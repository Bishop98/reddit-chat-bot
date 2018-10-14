# --Bishop
Reddit Chat bot, interacts with Reddit's sendbird backend


Note: The websocket package causes an error as is. I've included a fix in the "WebsocketFile" directory.
      To replace the file, simply copy it out of the directory and paste it into /node_modules/websocket/lib

The error that this fixes is logged as:

internal/buffer.js:35
    throw new ERR_OUT_OF_RANGE('value', `>= ${min} and <= ${max}`, value);
    ^

If you see this error, make sure you have correctly replaced that file.
