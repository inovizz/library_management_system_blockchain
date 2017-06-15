#!/usr/bin/env bash
# this shell script's purpose is to generate LMS.json and run overdue_books_reminder.js script

cd lms/scripts
solc ../contracts/LMS.sol  --combined-json abi,asm,ast,bin,bin-runtime,clone-bin,devdoc,interface,opcodes,srcmap,srcmap-runtime,userdoc > ../build/LMS.json
node overdue_books_reminder.js