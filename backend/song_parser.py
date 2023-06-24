import guitarpro

def parseSong(file):
    song = guitarpro.parse(file)
    print(song.measureHeaders[0].timeSignature)