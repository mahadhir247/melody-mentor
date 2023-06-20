import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC0oRGRLhfnZdQtsweJ1Q7VG1fHDLid5ws",
  authDomain: "orbitalapp-4da0d.firebaseapp.com",
  projectId: "orbitalapp-4da0d",
  storageBucket: "orbitalapp-4da0d.appspot.com",
  messagingSenderId: "991219715789",
  appId: "1:991219715789:web:7edb6e7a1f9adf6d8a2384",
  measurementId: "G-7WV1X1TPMS",
  type: "service_account",
  project_id: "orbitalapp-4da0d",
  private_key_id: "4af45d41ef9c7a37c16973c8cce2f932c04b988b",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCma428Qb4ByqTJ\nWNqJNDx8EmudMIOnMJDVqHkbR1Wc6r4HXvQoJkja7rKLtL7rihNJ6wJJFC3nRJYD\nFh4lHcSNKZULiee+sqh2vYo81qsbLZk2oY19xd4+VYAHmTu9vEZXSxxhtlcoN/Xq\nrnisQG2EwlM3wcJFyB/aUf/3RkCwLrbH4V8nGhQD2jRSz6C8mFqUAyex8cIQfxnY\n4oGU7BQ36zPlaBcSYw1+SHH4r5nYYMY1tJcyaNtD8AsZ9HOesBA38S64SJtorNCM\nM+KDeIs0KMNCsN/lqDc9+X4HJL5NHtMiAkmO9bi+R+o7wURCn1kTQySpQDg1jJ6x\nkmkEk0wFAgMBAAECggEAF1hoIhwQ1PyB4FLsGSowP/FvkjXvigEYmDhRgN+hZWlS\nrgMGeilguAGbH1kEHVOZwBlNEUZY6CPpbVZpdSh3XZwTMfKvBUPXuQx+u2kbyKy9\nXPoNuLKMqi7hTm+S/1tNfMpnGVf0Ywpyn3DJMdS56FFATkaKg7J+sWgmYaBDy9MP\nnEQGYEC6JaTlFgN+o2M2Cy1FVI5I6vhFnlV9PZCoK/EMY3MKOu8nXeatOyOFPuSl\noP3qq9Y4Hvx0dojZQudquPMEa/zG0tUixVFmUGwTYVUR7UPfDin4RxO3JkYeYFMv\nGdeu0jiOvrW6G5wL6CdtRnXSC+ZQRyjgggjQsQXS8QKBgQDinpzwKUGaaRIH3QVE\nPbOXfSgZF8aitU7wkW4wtIrYS7ObEsSkwaSjlOObek8RzUh2kjTDGruQqZRV+OUG\nwFhV/ykEly/eRkweWf8S/T9HiFA3/Z/kVeu8avE94NGiOPOcxEOYyZRwjz2IZpwi\noS3GysLIM2F1/kuhTXhCskUC7QKBgQC7/vOw2l4DHE4pO4ju97h2HOAjgVrLj6wO\n+dE/w4VCiImCj2gobWoL7kQEmPLn559ZNrf2A/cVd7AqRsvnrNsWFrS3x9FORvtr\nDS48QMeIqWWW6fXr7NLs0tZmfl2Pw/w5hqR0ixaZwB4k0CuXVD7zJdg+AUUZzi//\nzVmhuXlSeQKBgAu8byA44r7eZiKmHZm1IFHeF2+FPbI7dYUb4vr+vpoJAZosVKa7\nqI0YLtlkcifX28LYO4dHISOSxK3XH/VDjM+XUUZ9lesK9PI1cvJGzzojIxRjPB6V\nHIo7d5bex7yA+ozJ1T5aYieaI3Om7LsWYcqDwaagkpGLw9rsqie6F7zZAoGAfLRN\nUGY58JRJIL7WQbZfTTIwWD0JTni6aKC8djCraAwMM2gPbqnNq6ZcxjPzBXQ21sYe\nV3of38SqPhECV2bpWYisTjClHeimBEgVAHD0Kyo7MlV2BQ7uh5wADrMKO0CFQl+X\nHZvZ3Rl8pWzVTafbrgzPmanb/Zcxbdz49PeEi/kCgYEAh+Ew7To1L5MWKZxbZVV5\nEbNJ7K/VT4f0oVZSNPRF7F55F/Jszw8q1RuRiUhvmlbGnvvZGzhxUlZoV8m3/EO/\n0p/jv2335POa4PztPfF4bx9q+xJIUzcNIqF6YaWunyN0921NSi3koc5qy08MmIBH\nrkA5c/WUAMb/7bRHMGbN4Sk=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-3ov1k@orbitalapp-4da0d.iam.gserviceaccount.com",
  client_id: "104628224578500228849",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3ov1k%40orbitalapp-4da0d.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
