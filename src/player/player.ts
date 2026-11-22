/**
 * Motor de reproducción de Melarmonía (etapa 3).
 *
 * Usa `AudioPlaylist` de expo-audio: la lista se reproduce en el lado nativo, así que el paso
 * de una canción a otra, la notificación, la pantalla de bloqueo, los botones de los auriculares
 * y la pausa al desconectarlos funcionan aunque la pantalla esté apagada.
 *
 * La cola vive en `usePlayer` (zustand) en el mismo orden que la lista nativa.
 */
import {
  createAudioPlaylist,
  requestNotificationPermissionsAsync,
  setAudioModeAsync,
  type AudioMetadata,
  type AudioPlaylist,
  type AudioPlaylistLoopMode,
  type AudioPlaylistStatus,
} from 'expo-audio';
import { create } from 'zustand';

import type { Song } from '@/library/types';
import { loadPlayback, savePlayback, type RepeatMode } from '@/storage/playback';
import { storage } from '@/storage/settings';
import { showToast } from '@/store/toast';

import { shuffledStartingWith } from './shuffle';

export type { RepeatMode };

interface PlayerState {
  /** Cola en el orden en que suena. */
  queue: Song[];
  /** Clave única de cada elemento de la cola (una canción puede estar dos veces). */
  keys: string[];
  /** Cola en su orden original (para quitar el aleatorio). */
  original: Song[];
  index: number;
  current: Song | null;
  playing: boolean;
  buffering: boolean;
  positionSec: number;
  durationSec: number;
  shuffle: boolean;
  repeat: RepeatMode;
  /** "Reproduciendo desde": nombre de la lista, álbum o artista. */
  sourceLabel: string;
}

export const usePlayer = create<PlayerState>(() => ({
  queue: [],
  keys: [],
  original: [],
  index: 0,
  current: null,
  playing: false,
  buffering: false,
  positionSec: 0,
  durationSec: 0,
  shuffle: false,
  repeat: 'off',
  sourceLabel: '',
}));

const set = usePlayer.setState;
const get = usePlayer.getState;

let keyCounter = 0;
const newKey = () => `q${++keyCounter}`;
const keysFor = (songs: Song[]) => songs.map(newKey);

// --- Lista nativa -------------------------------------------------------------

let playlist: AudioPlaylist | null = null;
let subscriptions: { remove: () => void }[] = [];
let lockScreenActive = false;
let audioModeReady = false;
let consecutiveErrors = 0;
let lastSavedAt = 0;

const LOCK_SCREEN_OPTIONS = {
  showNextTrack: true,
  showPreviousTrack: true,
  showSeekForward: false,
  showSeekBackward: false,
};

const RESTART_THRESHOLD_SEC = 3;
const SAVE_EVERY_MS = 5000;
const MAX_CONSECUTIVE_ERRORS = 5;

function loopFor(repeat: RepeatMode): AudioPlaylistLoopMode {
  return repeat === 'all' ? 'all' : repeat === 'one' ? 'single' : 'none';
}

function metadataFor(song: Song): AudioMetadata {
  return {
    title: song.title,
    artist: song.artist,
    albumTitle: song.album,
    artworkUrl: song.artworkPath ?? undefined,
  };
}

async function ensureAudioMode() {
  if (audioModeReady) return;
  audioModeReady = true;
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
    });
  } catch {
    audioModeReady = false;
  }
}

/** Android 13+: los controles de la notificación necesitan este permiso. Se pide una sola vez. */
function askNotificationsOnce() {
  if (storage.getBoolean('askedNotifications')) return;
  storage.set('askedNotifications', true);
  requestNotificationPermissionsAsync().catch(() => {});
}

function activateLockScreen() {
  const { current } = get();
  if (!playlist || !current) return;
  if (lockScreenActive) {
    playlist.updateLockScreenMetadata(metadataFor(current));
  } else {
    playlist.setActiveForLockScreen(true, metadataFor(current), LOCK_SCREEN_OPTIONS);
    lockScreenActive = true;
  }
}

function destroyPlaylist() {
  subscriptions.forEach((s) => s.remove());
  subscriptions = [];
  if (playlist) {
    try {
      if (lockScreenActive) playlist.clearLockScreenControls();
      playlist.destroy();
    } catch {
      // ya liberada
    }
  }
  playlist = null;
  lockScreenActive = false;
}

/** Crea la lista nativa con la cola actual y la deja en la canción y posición indicadas. */
async function buildPlaylist(options: { positionSec?: number; autoplay: boolean }) {
  const { queue, index, repeat } = get();
  destroyPlaylist();
  if (queue.length === 0) return;

  await ensureAudioMode();
  const created = createAudioPlaylist({
    sources: queue.map((s) => ({ uri: s.uri })),
    loop: loopFor(repeat),
    // 1 s basta para la barra de progreso y despierta menos la app en segundo plano.
    updateInterval: 1000,
  });
  playlist = created;
  subscriptions = [
    created.addListener('playlistStatusUpdate', onStatus),
    created.addListener('trackChanged', ({ currentIndex }) => onTrackChanged(currentIndex)),
  ];

  if (index > 0) created.skipTo(index);
  if (options.positionSec && options.positionSec > 0) {
    await created.seekTo(options.positionSec).catch(() => {});
  }
  if (options.autoplay) {
    activateLockScreen();
    created.play();
  }
}

function onTrackChanged(currentIndex: number) {
  const { queue } = get();
  const current = queue[currentIndex] ?? null;
  set({ index: currentIndex, current, positionSec: 0 });
  if (lockScreenActive && current && playlist)
    playlist.updateLockScreenMetadata(metadataFor(current));
  persist(true);
}

function onStatus(status: AudioPlaylistStatus) {
  if ('error' in status && status.error) {
    handleError();
    return;
  }
  if (status.playing) consecutiveErrors = 0;

  const wasPlaying = get().playing;
  set({
    playing: status.playing,
    buffering: status.isBuffering,
    positionSec: status.currentTime,
    durationSec: status.duration || (get().current?.durationMs ?? 0) / 1000,
  });

  // Guarda la posición de vez en cuando y siempre al pausar.
  persist(wasPlaying && !status.playing);
}

/** Archivo dañado o borrado: aviso y salto a la siguiente (pantallas y flujos, 3.4). */
function handleError() {
  consecutiveErrors += 1;
  showToast('No se pudo reproducir esta canción', 'error');
  const { index, queue, repeat } = get();
  const hasNext = index < queue.length - 1 || repeat === 'all';
  if (!playlist || !hasNext || consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
    playlist?.pause();
    set({ playing: false });
    return;
  }
  playlist.next();
  playlist.play();
}

function persist(force = false) {
  const now = Date.now();
  if (!force && now - lastSavedAt < SAVE_EVERY_MS) return;
  lastSavedAt = now;
  const s = get();
  if (s.queue.length === 0) return;
  savePlayback({
    queueIds: s.queue.map((x) => x.id),
    originalIds: s.original.map((x) => x.id),
    index: s.index,
    positionSec: s.positionSec,
    shuffle: s.shuffle,
    repeat: s.repeat,
    sourceLabel: s.sourceLabel,
  });
}

// --- Acciones -----------------------------------------------------------------

/**
 * Reproduce una lista de canciones empezando por `startIndex`.
 * Con el modo aleatorio activo, la canción elegida suena primero y el resto se mezcla.
 */
export async function playSongs(
  songs: Song[],
  startIndex: number,
  sourceLabel: string,
  options: { shuffle?: boolean } = {},
) {
  if (songs.length === 0) return;
  askNotificationsOnce();
  const shuffle = options.shuffle ?? get().shuffle;
  const start = Math.min(Math.max(startIndex, 0), songs.length - 1);
  const queue = shuffle
    ? shuffledStartingWith(songs, options.shuffle && startIndex < 0 ? undefined : start)
    : songs;
  const index = shuffle ? 0 : start;
  consecutiveErrors = 0;
  set({
    queue,
    keys: keysFor(queue),
    original: songs,
    index,
    current: queue[index],
    shuffle,
    sourceLabel,
    positionSec: 0,
    durationSec: queue[index].durationMs / 1000,
    playing: true,
  });
  await buildPlaylist({ autoplay: true });
  persist(true);
}

/** Reproducir todo en orden aleatorio. */
export function shuffleAll(songs: Song[], sourceLabel: string) {
  return playSongs(songs, -1, sourceLabel, { shuffle: true });
}

export async function togglePlay() {
  const { queue, playing } = get();
  if (queue.length === 0) return;
  if (!playlist) {
    await buildPlaylist({ positionSec: get().positionSec, autoplay: true });
    return;
  }
  if (playing) {
    playlist.pause();
  } else {
    activateLockScreen();
    playlist.play();
  }
}

export function next() {
  const { index, queue, repeat } = get();
  if (!playlist) return;
  if (index >= queue.length - 1 && repeat !== 'all') return;
  playlist.next();
}

/** Anterior: si van más de 3 s, vuelve al inicio de la canción (manual de usuario, 4). */
export function previous() {
  const { index, positionSec, repeat } = get();
  if (!playlist) return;
  if (positionSec > RESTART_THRESHOLD_SEC || (index === 0 && repeat !== 'all')) {
    playlist.seekTo(0).catch(() => {});
    set({ positionSec: 0 });
    return;
  }
  playlist.previous();
}

export function seekTo(seconds: number) {
  set({ positionSec: seconds });
  playlist?.seekTo(seconds).catch(() => {});
}

export function skipTo(index: number) {
  if (!playlist || index < 0 || index >= get().queue.length) return;
  playlist.skipTo(index);
  playlist.play();
}

export function cycleRepeat() {
  const order: RepeatMode[] = ['off', 'all', 'one'];
  const repeat = order[(order.indexOf(get().repeat) + 1) % order.length];
  set({ repeat });
  if (playlist) playlist.loop = loopFor(repeat);
  persist(true);
}

/** Activa o quita el aleatorio sin cortar la canción actual. */
export async function toggleShuffle() {
  const { shuffle, queue, original, current, positionSec, playing } = get();
  if (!current || queue.length === 0) {
    set({ shuffle: !shuffle });
    return;
  }
  if (!shuffle) {
    const currentInOriginal = original.findIndex((s) => s.id === current.id);
    const shuffledQueue = shuffledStartingWith(original, currentInOriginal);
    set({ shuffle: true, queue: shuffledQueue, keys: keysFor(shuffledQueue), index: 0 });
  } else {
    const index = Math.max(
      0,
      original.findIndex((s) => s.id === current.id),
    );
    set({ shuffle: false, queue: original, keys: keysFor(original), index });
  }
  await buildPlaylist({ positionSec, autoplay: playing });
  persist(true);
}

/**
 * Recupera la última cola al abrir la app, en pausa y en la misma posición.
 * Las canciones que ya no existen se descartan.
 */
export function restorePlayback(songsById: Map<string, Song>) {
  if (get().queue.length > 0) return;
  const saved = loadPlayback();
  if (!saved) return;

  const currentId = saved.queueIds[saved.index];
  const queue = saved.queueIds.map((id) => songsById.get(id)).filter((s): s is Song => !!s);
  const original = saved.originalIds.map((id) => songsById.get(id)).filter((s): s is Song => !!s);
  if (queue.length === 0) return;

  const found = queue.findIndex((s) => s.id === currentId);
  const index = found >= 0 ? found : Math.min(saved.index, queue.length - 1);
  set({
    queue,
    keys: keysFor(queue),
    original: original.length > 0 ? original : queue,
    index,
    current: queue[index],
    shuffle: saved.shuffle,
    repeat: saved.repeat,
    sourceLabel: saved.sourceLabel,
    positionSec: found >= 0 ? saved.positionSec : 0,
    durationSec: queue[index].durationMs / 1000,
    playing: false,
  });
}

// --- Cola (etapa 4) -------------------------------------------------------------

/** Tras cambiar la lista nativa, toma de ella la posición real de la canción actual. */
function syncIndexFromNative() {
  if (!playlist) return;
  const index = playlist.currentIndex;
  const { queue } = get();
  if (index >= 0 && index < queue.length) set({ index, current: queue[index] });
}

/** Mantiene la cola original al día para poder quitar el aleatorio sin perder cambios. */
function syncOriginal(change: (original: Song[]) => Song[]) {
  const { shuffle, queue, original } = get();
  set({ original: shuffle ? change(original) : queue });
}

/** "Reproducir a continuación": la canción sonará justo después de la actual. */
export async function playNext(song: Song) {
  const { queue, keys, index, current } = get();
  if (queue.length === 0) {
    await playSongs([song], 0, 'Cola');
    return;
  }
  const at = index + 1;
  set({
    queue: [...queue.slice(0, at), song, ...queue.slice(at)],
    keys: [...keys.slice(0, at), newKey(), ...keys.slice(at)],
  });
  syncOriginal((original) => {
    const pos = current ? original.findIndex((s) => s.id === current.id) : -1;
    return pos < 0
      ? [...original, song]
      : [...original.slice(0, pos + 1), song, ...original.slice(pos + 1)];
  });
  playlist?.insert({ uri: song.uri }, at);
  syncIndexFromNative();
  persist(true);
  showToast(`«${song.title}» sonará a continuación`, 'success');
}

/** "Añadir a la cola": la canción irá al final. */
export async function addToQueue(song: Song) {
  const { queue, keys } = get();
  if (queue.length === 0) {
    await playSongs([song], 0, 'Cola');
    return;
  }
  set({ queue: [...queue, song], keys: [...keys, newKey()] });
  syncOriginal((original) => [...original, song]);
  playlist?.add({ uri: song.uri });
  persist(true);
  showToast(`«${song.title}» añadida a la cola`, 'success');
}

/** Quita una canción de la cola. La que está sonando no se puede quitar. */
export function removeFromQueue(position: number) {
  const { queue, keys, index } = get();
  if (position === index || position < 0 || position >= queue.length) return;
  const removed = queue[position];
  const nextIndex = position < index ? index - 1 : index;
  const nextQueue = queue.filter((_, i) => i !== position);
  set({
    queue: nextQueue,
    keys: keys.filter((_, i) => i !== position),
    index: nextIndex,
    current: nextQueue[nextIndex],
  });
  syncOriginal((original) => {
    const pos = original.findIndex((s) => s.id === removed.id);
    return pos < 0 ? original : original.filter((_, i) => i !== pos);
  });
  playlist?.remove(position);
  syncIndexFromNative();
  persist(true);
}

/** Mueve una canción dentro de la cola (arrastrar para reordenar). */
export function moveInQueue(from: number, to: number) {
  const { queue, keys, index } = get();
  if (from === to || from < 0 || to < 0 || from >= queue.length || to >= queue.length) return;
  // La canción que suena no se mueve: moverla en la lista nativa cortaría la reproducción.
  if (from === index || to === index) return;
  const nextQueue = [...queue];
  const nextKeys = [...keys];
  const [song] = nextQueue.splice(from, 1);
  const [key] = nextKeys.splice(from, 1);
  nextQueue.splice(to, 0, song);
  nextKeys.splice(to, 0, key);

  let nextIndex = index;
  if (from === index) nextIndex = to;
  else if (from < index && to >= index) nextIndex = index - 1;
  else if (from > index && to <= index) nextIndex = index + 1;

  set({ queue: nextQueue, keys: nextKeys, index: nextIndex, current: nextQueue[nextIndex] });
  syncOriginal((original) => original);
  if (playlist) {
    playlist.remove(from);
    playlist.insert({ uri: song.uri }, to);
    syncIndexFromNative();
  }
  persist(true);
}

/** Vacía lo que queda por sonar, dejando la canción actual y las anteriores. */
export function clearUpcoming() {
  const { queue, keys, index } = get();
  if (queue.length - index - 1 <= 0) return;
  const kept = queue.slice(0, index + 1);
  set({ queue: kept, keys: keys.slice(0, index + 1) });
  syncOriginal(() => kept);
  if (playlist) for (let i = queue.length - 1; i > index; i--) playlist.remove(i);
  persist(true);
  showToast('Cola vaciada');
}
