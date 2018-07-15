# Ginger
Browser for large logs


## Overview

Ginger is a browser for large log files written in Electron. The reason it was
created is current lack of similar tools in Windows and Linux. The closest match
on Windows is Notepad++ but it handles files up to 1GB. On Linux there is Gedit
but loading files takes a long time. Ginger handles unlimited size of files and
allows for efficient search of patterns. It is implemented as ES6 Node.js
application with frontend currently written in Vue. There are plans however to
rewrite display to canvas for efficiency. Buffers are read from file directly in small
chunks which leaves minimal memory footprint.

## Features

#### Text Search

Currently strings not regex are searched for performance reasons. This is pretty fast, time
to wait should be 1 second per GB on modern machine.
Once found results can be cycled in buffer.

#### Tabs

Trivial but helpful, everything is handled on
per tab basis.

#### Colorizing

Feature similar as in wireshark. Custom regex
can make lines colored, it can help in navigating.
Coloring is remembered per tab.

#### Go to line

Jumps to line number, if overflown default value is
picked.

#### Bookmarks

Still needs implementing context menu for
right clicking. Currently
line numbers have to entered manually.


## Developers View

Application is logically split into backend and frontend.

Backend implements handling of files. Text is treated as collection of lines, bunch of which
constitutes a chunk. Backend remembers start and end offsets of lines and uses them to load them into memory on demand. After exceeding chunk boundaries
new one is loaded automatically. Code is asynchronous and based on promises.

Frontend is implemented in Vue. Code is split into collection of Vue components, located in Javascript files. Templates are hardcoded as strings, better way would be to use .vue files, but this would require using bundler, which is not needed for this project. Core part is a buffer which displays chunks from backend. This is most complicated part as it requires a mix of vue and pure dom manipulations to work together.

## Keys

| Key | Action |
| ----| -----  |
|Enter|Do search|
|Esc | Quit modal|
|Up, Down| . |
|PageUp, PageDown| . |
|Ctrl+O | Open file |
|Ctrl+S | Open Settings|
|Ctrl+F | Find in file|
|Ctrl+M | Bookmarks |
|Ctrl+X | Colorize |
|Ctrl+G | Go to line|


## Usage

In relases you can find most recent package of working program. Unpack it and folder should contain  executable to be run. You can also
run it as npm project:

`npm install`

`npm test`

`npm start`
