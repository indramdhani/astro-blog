---
title: "Use an Amazon EBS Volume on Linux"
publishDate: "16 June 2020"
description: "Suppose that you have created a new EBS volume for your instance. In order to use the new volume you have to attach it to your instance and then format it."
categories:
  - "notebook"
  - "server-series"
tags:
  - "aws-series"
  - "ebs"
  - "ec2"
---

Suppose that you have created a new EBS volume for your instance. In order to use the new volume you have to attach it to your instance and then format it.

### Attach EBS volume to EC2 instance

- Login to your AWS console, then go to `EC2` menu and choose `Volumes` submenu under `Elastic Block Store` section.
- Select your new volume then click `Actions`, and choose `Attach Volume`. Choose instance that will use the new volume.
- Once completed, the new volume will be attached to the EC2 instance.

### Mount and format an attached volume

Suppose that the root device volume is `/dev/xvda` and the new attached EBS volume `/dev/xvdb` . Use the following to mount the new volume

- Connect to your instance using SSH.
- Use `lsblk` command to view your disk device and their mount points (if mounted).

```
lsblk
NAME          MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
nvme0n1       259:3    0   8G  0 disk
├─nvme0n1p1   259:4    0   8G  0 part /
└─nvme0n1p128 259:5    0   1M  0 part
nvme1n1       259:2    0  50G  0 disk
```

- Check if there is any file system on the volume. If you create the volume from the `snapshot`, there is likely the volume already have file system. Below is the sample for no file system on the volume.

```
sudo file -s /dev/nvme1n1
/dev/nvme1n1: data
```

Below is the sample for volume with file system

```
sudo file -s /dev/nvme1n1
/dev/nvme1n1: SGI XFS filesystem data (blksz 4096, inosz 512, v2 dirs)
```

- If you have and empty volume use the `mkfs -t` to create a file system. You will remove / format the volume if the volume is not empty

```
sudo yum install xfsprogs
sudo mkfs -t xfs /dev/nvme1n1
```

- Use the `mkdir` to create a mount point directory.

```
sudo mkdir /media/data
```

- Mount the volume.

```
sudo mount /dev/nvme1n1 /media/data
```

### Automatically mount an attached volume on reboot

The mount point on the step before is not preserved after rebooting your instance. To mount automatically follow procedure below

- (optional) Create a backup of `/etc/fstab`.

```
sudo cp /etc/fstab /etc/fstab.original
```

- Use the `blkid` or `lsblk` to find the UUID of the device.

```
sudo blkid
/dev/nvme0n1p1: LABEL="/" UUID="43c07df6-e944-4b25-8fd1-5ff848b584b2" TYPE="ext4" PARTLABEL="Linux" PARTUUID="e3466a0c-3a36-48a8-8bc2-f5ab5ee2afec"
/dev/nvme1n1: UUID="95319669-3a31-4f23-9a80-2d90370a25a5" TYPE="xfs"
```

- Edit the `/etc/fstab` to add the new mount point.

```
sudo nano /etc/fstab
```

Add the entry below

```
UUID=95319669-3a31-4f23-9a80-2d90370a25a5  /media/data  xfs  defaults,nofail  0  2
```

- Verify the `/etc/fstab` by unmount the volume the mount it.

```
sudo umount /media/data
sudo mount -a
```

source: [https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-using-volumes.html](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-using-volumes.html)
