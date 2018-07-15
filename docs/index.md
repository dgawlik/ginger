---
layout: default
---

## Overview

Ginger is a browser for large log files written in Electron. The reason it was
created is current lack of similar tools in Windows and Linux. The closest match
on Windows is Notepad++ but it handles files up to 1GB. On Linux there is Gedit
but loading files takes a long time. Ginger handles unlimited size of files and
allows for efficient search of patterns. It is implemented as ES6 Node.js
application with frontend currently written in Vue. There are plans however to
rewrite display to canvas for efficiency. Buffers are read from file directly in small
chunks which leaves minimal memory footprint.
