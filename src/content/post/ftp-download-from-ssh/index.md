---
title: "FTP download from SSH"
publishDate: "2021-02-12"
description: "Download a whole FTP directory from an SSH session with a single wget command."
tags:
  - "server-series"
  - "ftp"
  - "ssh"
---

```
wget -m ftp://this.is.the.host/this/is/directory/* --ftp-user=ftp_user --ftp-password=ftp_password
```
