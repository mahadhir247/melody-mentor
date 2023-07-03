import guitarpro

def parseSong(file):
    song = guitarpro.parse(file)
    print(song.title)
    print(song.measureHeaders[0].timeSignature)