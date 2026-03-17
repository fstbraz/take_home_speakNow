import { Injectable } from '@angular/core';
import { from, map, Observable, switchMap } from 'rxjs';
import { IDBPDatabase, openDB } from 'idb';
import { VideoMeta } from '../state/videos.state';

const DB_NAME = 'speaknow-db';
const DB_VERSION = 1;
const STORE_META = 'videos-meta';
const STORE_BLOB = 'videos-blob';

@Injectable({ providedIn: 'root' })
export class VideoStorageService {
  private db$: Observable<IDBPDatabase>;

  constructor() {
    this.db$ = from(
      openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_META)) {
            db.createObjectStore(STORE_META, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORE_BLOB)) {
            db.createObjectStore(STORE_BLOB, { keyPath: 'id' });
          }
        },
      }),
    );
  }

  getAllMeta(): Observable<VideoMeta[]> {
    return this.db$.pipe(
      switchMap(db => from(db.getAll(STORE_META))),
    );
  }

  saveVideo(meta: VideoMeta, blob: Blob): Observable<void> {
    return this.db$.pipe(
      switchMap(db => {
        const tx = db.transaction([STORE_META, STORE_BLOB], 'readwrite');
        // idb transactions are Promise-based; from() bridges them to Observable
        return from(
          Promise.all([
            tx.objectStore(STORE_META).put(meta),
            tx.objectStore(STORE_BLOB).put({ id: meta.id, blob }),
            tx.done,
          ]).then(() => undefined as void),
        );
      }),
    );
  }

  getBlobUrl(id: string): Observable<string | null> {
    return this.db$.pipe(
      switchMap(db => from(db.get(STORE_BLOB, id))),
      map((record: { id: string; blob: Blob } | undefined) =>
        record ? URL.createObjectURL(record.blob) : null,
      ),
    );
  }

  deleteVideo(id: string): Observable<void> {
    return this.db$.pipe(
      switchMap(db => {
        const tx = db.transaction([STORE_META, STORE_BLOB], 'readwrite');
        // idb transactions are Promise-based; from() bridges them to Observable
        return from(
          Promise.all([
            tx.objectStore(STORE_META).delete(id),
            tx.objectStore(STORE_BLOB).delete(id),
            tx.done,
          ]).then(() => undefined as void),
        );
      }),
    );
  }
}
