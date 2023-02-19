---
title: "Docker Installation"
publishDate: "2020-11-02"
description: "Step-by-step guide to install Docker on Ubuntu Server"
categories:
  - "docker-series"
  - "notebook"
tags:
  - "docker-series"
  - "docker"
---

Update your packages list:

```
sudo apt update
```

Then install required packages that let `apt` use package over HTTPS:

```
sudo apt install apt-transport-https ca-certificates curl software-properties-common
```

Then add the GPG key for the official Docker repository:

```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

Then add the Docker repository to APT sources:

```
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable""
```

Update the package database:

```
sudo apt update
```

Before install Docker. make sure the installation source is from the Docker repository instead of the Ubuntu repository:

```
apt-cache policy docker-ce
```

The output would be like this, the version number of Docker may be different:

```
docker-ce:
  Installed: (none)
  Candidate: 5:19.03.9~3-0~ubuntu-focal
  Version table:
     5:19.03.9~3-0~ubuntu-focal 500
        500 https://download.docker.com/linux/ubuntu focal/stable amd64 Packages
```

The Docker status is not installed, but the installation candidate is from the Docker repository for Ubuntu 20.04.

Install the docker

```
sudo apt install docker-ce
```

Once installed, the daemon will be started and the process enabled on the boot. Check that it's running:

```
sudo systemctl status docker
```

The output will show that the service is active and running.
