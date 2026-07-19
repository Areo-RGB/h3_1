# Firebase Realtime Database Schemas

This document defines the schema definitions for each resource branch in the Firebase Realtime Database.

## 1. Mitglieder (`/mitglieder`)

This branch contains the list of team members and admins.

```json
{
  "member_id": {
    "id": "string",
    "name": "string",
    "password": "string (defaults to '1234')",
    "type": "admin | user",
    "firstName": "string (optional)",
    "lastName": "string (optional)",
    "birthDate": "string (YYYY-MM-DD, optional)",
    "contact": "string (optional)",
    "imageUrl": "string (optional)"
  }
}
```

## 2. Termine & Spiele (`/termine`)

This branch contains training sessions, matches, and other events.

```json
{
  "termin_id": {
    "id": "string",
    "day": "string (e.g., 'Mo.', 'Di.', 'Mi.')",
    "date": "string (DD.MM format, e.g., '29.06')",
    "fullDate": "string (YYYY-MM-DD format, e.g., '2026-06-29')",
    "title": "string (e.g., 'Training', 'Heimspiel')",
    "type": "training | spiel",
    "startTime": "string (HH:MM, optional)",
    "endTime": "string (HH:MM, optional)",
    "address": "string (optional)",
    "opponent": "string (only for type='spiel', optional)",
    "status": {
      "member_id": "accepted | declined | null"
    }
  }
}
```

## 3. Umfragen (`/umfragen`)

This branch contains community polls and surveys created by admins.

```json
{
  "umfrage_id": {
    "id": "string",
    "title": "string",
    "subtitle": "string",
    "votes": {
      "member_id": "ja | nein"
    }
  }
}
```
