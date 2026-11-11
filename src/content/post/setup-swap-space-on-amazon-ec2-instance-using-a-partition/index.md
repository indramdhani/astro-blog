---
title: "Setup SWAP Space on Amazon EC2 Instance Using A Partition"
publishDate: "2020-06-17"
description: "setup and calculate the swap space on amazon ec2 instance"
tags:
  - "aws-series"
  - "aws"
  - "ec2"
---

## Calculate the swap space size

| Amount of System RAM | Recommended swap space |
| --- | --- |
| 2 GB of RAM or less | 2x the amount of RAM but never less than 32 MB |
| More than 2 GB of RAM but less than 32 GB | 4 GB + (RAM - 2 GB) |
| 32 GB of RAM or more | 1x the amount of RAM |

## Create a partition on hard disk as swap space

Login in to the instance using SSH

List the available volumes:

```
sudo fdisk -l
```

Select a device to partition from the list, let's use /dev/xvda.

```
sudo fdisk /dev/xvda
```

Create a new partition

```
-> n
```

Select a partition type, let's use primary

```
-> p
```

Assign the partition number, let's use partition 2:

```
-> 2
```

Accept the default of "First sector" by pressing **Enter.**

Enter the size of the swap file, let's use 4GB of swap file

```
-> +4G
```

Save and exit

```
-> w
```

## Setup the swap area

Use `partprobe` command to inform the OS of partition table change:

```
partprobe
```

Setup a linux swap area using the swap partition, let's use `/dev/xvda1`.

```
mkswap /dev/xvda1
```

Add the partition as swap space

```
sudo swapon /dev/xvda2
```

Show the current swap space

```
sudo swapon -s
```

## Update fstab to make the swap allocation permanent on reboot

Update the `/etc/fstab`, add new entry to make the swap partition available on reboot

```
sudo nano /etc/fstab
```

Add the new entry

```
/dev/xvda1 none swap sw 0 0
```

source: [https://aws.amazon.com/premiumsupport/knowledge-center/ec2-memory-partition-hard-drive/](https://aws.amazon.com/premiumsupport/knowledge-center/ec2-memory-partition-hard-drive/)
