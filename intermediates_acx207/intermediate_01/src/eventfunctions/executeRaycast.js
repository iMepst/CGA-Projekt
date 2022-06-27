import * as THREE from 'three';

window.raycaster = new THREE.Raycaster();

export function executeRaycast() {

    window.raycaster.setFromCamera(window.mousePosition, window.camera);
    let intersects = window.raycaster.intersectObject(window.scene, true);

    if (intersects.length > 0) {
        let firstHit = intersects[0].object;
        let name = firstHit.name;
        console.log(name);

        if (name === 'BluetoothGLTF') {
            firstHit.parentSpeaker.animations.get('pushBluetoothButton').stop();
            firstHit.parentSpeaker.animations.get('pushBluetoothButton').play();
            firstHit.parentSpeaker.state.bluetoothOn = !firstHit.parentSpeaker.state.bluetoothOn;
            console.log(firstHit.parentSpeaker.state.bluetoothOn);
        } else if (name === 'Volume_HighGLTF') {
            firstHit.parentSpeaker.animations.get('pushVolumeHigh').stop();
            firstHit.parentSpeaker.animations.get('pushVolumeHigh').play();
            firstHit.parentSpeaker.state.higherVolume = true;
            console.log(firstHit.parentSpeaker.state.higherVolume);
        } else if (name === 'Volume_LowGLTF') {
            firstHit.parentSpeaker.animations.get('pushVolumeLow').stop();
            firstHit.parentSpeaker.animations.get('pushVolumeLow').play();
            firstHit.parentSpeaker.state.lowerVolume = true;
            console.log(firstHit.parentSpeaker.state.lowerVolume);
        } else if (name === 'PlayGLTF') {
            firstHit.parentSpeaker.animations.get('pushPlayButton').stop();
            firstHit.parentSpeaker.animations.get('pushPlayButton').play();
            firstHit.parentSpeaker.state.musicPlayingSpeaker = !firstHit.parentSpeaker.state.musicPlayingSpeaker;
            firstHit.parentSpeaker.phone.state.musicPlayingPhone = !firstHit.parentSpeaker.phone.state.musicPlayingPhone;
            console.log(firstHit.parentSpeaker.state.musicPlayingSpeaker);
        } else if (name === 'PowerGLTF') {
            firstHit.parentSpeaker.animations.get('pushPowerButton').stop();
            firstHit.parentSpeaker.animations.get('pushPowerButton').play();
            firstHit.parentSpeaker.state.powerOn = !firstHit.parentSpeaker.state.powerOn;
            console.log(firstHit.parentSpeaker.state.powerOn);
        } else if (name === "playButtonPhone") {
            firstHit.parentPhone.state.musicPlayingPhone = !firstHit.parentPhone.state.musicPlayingPhone;
            firstHit.parentPhone.speakerFromFile.state.musicPlayingSpeaker = !firstHit.parentPhone.speakerFromFile.state.musicPlayingSpeaker;
            firstHit.parentPhone.speaker.state.musicPlayingSpeaker = !firstHit.parentPhone.speaker.state.musicPlayingSpeaker;
            console.log(firstHit.parentPhone.state.musicPlayingPhone);
            firstHit.parentPhone.speaker.updateFunctionalState();
            firstHit.parentPhone.speakerFromFile.updateFunctionalState();

        } else if (name === "bluetoothButton") {
            firstHit.downAnimation.stop();
            firstHit.downAnimation.start();
            firstHit.parent.parent.state.bluetoothOn = !firstHit.parent.parent.state.bluetoothOn;
            console.log(firstHit.parent.parent.state.bluetoothOn);
        } else if (name === "playButton") {
            firstHit.downAnimation.stop();
            firstHit.downAnimation.start();
            firstHit.parent.parent.phone.state.musicPlayingPhone = !firstHit.parent.parent.phone.state.musicPlayingPhone;
            firstHit.parent.parent.state.musicPlayingSpeaker = !firstHit.parent.parent.state.musicPlayingSpeaker;
            console.log(firstHit.parent.parent.state.musicPlayingSpeaker);
        } else if (name === "volumeDownButton") {
            firstHit.downAnimation.stop();
            firstHit.downAnimation.start();
            firstHit.parent.parent.state.lowerVolume = !firstHit.parent.parent.state.lowerVolume;
            console.log(firstHit.parent.parent.state.lowerVolume);
        } else if (name === "volumeUpButton") {
            firstHit.downAnimation.stop();
            firstHit.downAnimation.start();
            firstHit.parent.parent.state.higherVolume = !firstHit.parent.parent.state.higherVolume;
            console.log(firstHit.parent.parent.state.higherVolume);
        } else if (name === "powerButton") {
            firstHit.downAnimation.stop();
            firstHit.downAnimation.start();
            firstHit.parent.parent.state.powerOn = !firstHit.parent.parent.state.powerOn;
            console.log(firstHit.parent.parent.state.powerOn);
        }
    }

}