---
title: "Executing the Docker Command Without Sudo (optional)"
publishDate: "2020-11-03"
description: find out how to execute docker command without sudo
tags:
  - "docker-series"
  - "docker"
---

Update your packages list:

By default, `docker` command can only be run by the **root** user or by an user in the **docker** group, that created during installation.

Below is the result if run `docker` without `sudo`

```
docker: Cannot connect to the Docker daemon. Is the docker daemon running on this host?.
See 'docker run --help'.
```

To Avoid typing `sudo` to run `docker` command, add the username to `docker` group:

```
sudo usermod -aG ${USER}
```

or

```
sudo usermod -ag username
```

To apply the new group membership, log out then log in again or type

```
su - ${USER}
```

The password will be prompted to continue.

Check of the user is added to the `docker` group by typing:

```
id -nG
```
