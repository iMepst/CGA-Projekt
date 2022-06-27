# CGA-Projekt
B.S. Media Systems. 4.Semester. Computergrafik & Animation.
ThreeJS.

## Usability 
Nutzbare Modelle:
* `iPhone 5s`: Dient dem starten und stoppen der Musik. 
* `SpeakerFromFile`: GLTF-Modell. Dient zum Abspielen der Musik. 
* `Speaker`: Selbst in Three.Js modelliertes Modell. Dient zum Abspielen der Musik.

Nutzbare Objekte:
* `PowerButton`: Dient zum an- bzw. ausschalten des Speaker.
* `BluetoothButton`: Dient zum an- bzw. ausschalten der Bluetooth-Funktionalität.
* `VolumeUpButton`: Dient zum erhöhen der Lautstärke.
* `VolumeDownButton`: Dient zum verringern der Lautstärke.
* `PlayButton`: Dient zum abspielen und stoppen der Musik.
* `PlayButtonPhone`: Dient zum abspielen und stoppen der Musik.


### Möglicher Ablauf GLTF-Modell
1. `SpeakerFromFile`: Power-Button wird gedrückt. Power-Licht geht an.


2. `SpeakerFromFile`: Bluetooth-Button wird gedrückt. Bluetooth-Licht geht an. Speaker ist bereit zum abspielen.


3. `SpeakerFromFile`: Play-Button wird gedrückt. Musik wird abgespielt.

ODER:
3. `iPhone 5s`: Play-Button auf dem Display wird gedrückt. Musik wird abgespielt.


4. `SpeakerFromFile`: Play-Button wird gedrückt. Musik wird gestoppt.

ODER:
4. `iPhone 5s`: Play-Button auf dem Display wird gedrückt. Musik wird gestoppt.


5. `SpeakerFromFile`: Power-Button wird gedrückt. Musik wird gestoppt. Lichter und Speaker sind aus.

### Möglicher Ablauf selbst-modelliertes Modell
1. `Speaker`: Power-Button wird gedrückt. Power-Licht geht an.


2. `Speaker`: Bluetooth-Button wird gedrückt. Bluetooth-Licht geht an. Speaker ist bereit zum abspielen.


3. `Speaker`: Play-Button wird gedrückt. Musik wird abgespielt.

ODER:
3. `iPhone 5s`: Play-Button auf dem Display wird gedrückt. Musik wird abgespielt.


4. `Speaker`: Play-Button wird gedrückt. Musik wird gestoppt.

ODER:
4. `iPhone 5s`: Play-Button auf dem Display wird gedrückt. Musik wird gestoppt.


5. `Speaker`: Power-Button wird gedrückt. Musik wird gestoppt. Lichten und Speaker sind aus.