import guitarpro

demo = guitarpro.parse('Oasis - Wonderwall (4) (1).gp3')
print(demo.measureHeaders[0].timeSignature)