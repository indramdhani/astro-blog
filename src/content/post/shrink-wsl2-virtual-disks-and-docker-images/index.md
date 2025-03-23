---
title: "How to Shrink WSL2 Virtual Disks and Docker Images"
publishDate: "09 September 2023"
description: "Learn how to reclaim disk space by shrinking WSL2 virtual disks and Docker images"
tags:
  - "wsl2"
  - "docker"
  - "windows"
---

If you're a developer using Windows Subsystem for Linux 2 (WSL2) and Docker, you might notice that your disk space gets eaten up over time. This is because WSL2 virtual disks and Docker images can grow but don't automatically shrink when you delete files. Here's how to reclaim that precious disk space.

## Understanding the Problem

WSL2 uses a Virtual Hard Disk (VHD) to store your Linux files. Similarly, Docker stores images and containers in its own storage area. Both of these can grow over time, but they don't automatically shrink when you delete files within them.

## Shrinking WSL2 Virtual Disk

1. First, shut down WSL:

```powershell
wsl --shutdown
```

2. Find your distribution's virtual hard disk. It's usually located at:

```
%USERPROFILE%\AppData\Local\Packages\<DistroPackageName>\LocalState\ext4.vhdx
```

3. Optimize the disk within WSL:

```bash
sudo fstrim -av
```

4. Use the Optimize-VHD command in PowerShell (run as Administrator):

```powershell
Optimize-VHD -Path "path-to-your-ext4.vhdx" -Mode Full
```

## Cleaning Up Docker

1. Remove unused containers:

```bash
docker container prune
```

2. Remove unused images:

```bash
docker image prune -a
```

3. Remove unused volumes:

```bash
docker volume prune
```

4. Remove all unused Docker resources:

```bash
docker system prune -a
```

## Best Practices to Prevent Disk Space Issues

1. Regularly clean up unused Docker resources
2. Use .dockerignore files to exclude unnecessary files
3. Implement multi-stage builds to reduce final image size
4. Periodically run disk optimization commands
5. Monitor disk usage with tools like Windows Storage Sense

## Additional Tips

- Use `docker system df` to check Docker disk usage
- Consider using WSL2's automatic memory reclamation feature
- Keep your WSL2 and Docker installations updated
- Use temporary directories for build artifacts

By following these steps and best practices, you can maintain better control over your disk space while using WSL2 and Docker. Remember to perform these maintenance tasks regularly as part of your development workflow.
