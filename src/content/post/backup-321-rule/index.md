---
title: "The 3-2-1 Backup Rule"
publishDate: "2026-11-28"
description: "Keep 3 copies on 2 kinds of media with 1 offsite: an example setup, media choices and the principles that make backups work."
tags:
  - "backup"
---

## The Rule

| Requirement | Description |
|-------------|-------------|
| **3 copies** | Total copies of data (original + 2 backups) |
| **2 media** | Backups on **different** storage media types |
| **1 offsite** | At least one copy stored offsite (geographically separate) |

## Example Implementation

```
Original data → Google Photos (cloud/offsite)
                ↓
           Synology NAS (local, different media: disk)
                ↓
           Monthly → External HDD (offline, different media)
```

## Media Diversity Examples

| Media Type | Examples |
|------------|----------|
| Cloud | Google Photos, S3, Backblaze B2, Google Drive |
| Local Disk | Synology/QNAP NAS, external HDD/SSD |
| Tape | LTO (enterprise) |
| Optical | M-DISC (archival) |

## Key Principles

1. **Different failure domains** — Cloud provider outage ≠ NAS failure ≠ HDD failure
2. **Offsite = geographic separation** — Different building minimum; different region preferred
3. **Test restores** — Untested backup = no backup
4. **Automate** — Manual backups don't happen
