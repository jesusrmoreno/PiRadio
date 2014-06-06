#!/bin/bash

# create variables
while read L; do
	k="`echo "$L" | cut -d '=' -f 1`"
	v="`echo "$L" | cut -d '=' -f 2`"
	export "$k=$v"
done < <(grep -e '^\(title\|artist\|album\|stationName\|songStationName\|pRet\|pRetStr\|wRet\|wRetStr\|songDuration\|songPlayed\|rating\|coverArt\|stationCount\|station[0-9]*\|audioUrl\)=' /dev/stdin) # don't overwrite $1...

# This is the important part.
case "$1" in
	songstart)
		# Write to the out file
		rm /Users/pi/Desktop/PiRadio/out # Replace with your own path.
		echo -e "$title\n$artist\n$stationName\n$coverArt" > /Users/pi/Desktop/PiRadio/out # Replace with your own path
esac
