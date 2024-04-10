(function() {
    'use strict';

    angular.module('screenShareApp', [])
        .controller('ScreenShareController', ['$scope', '$timeout', function($scope, $timeout) {
            var ctrl = this;
            var streamRef; // Reference to the stream to allow stopping

            ctrl.startSharing = function() {
                if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
                    navigator.mediaDevices.getDisplayMedia({ video: true })
                        .then(function(stream) {
                            streamRef = stream; // Keep a reference to the stream
                            var videoElement = document.getElementById('sharedScreen');
                            videoElement.style.display = 'block';
                            videoElement.srcObject = stream;
                        }).catch(function(error) {
                            console.error('Error: ', error);
                        });
                } else {
                    alert('Screen sharing is not supported in your browser.');
                }
            };

            ctrl.stopSharing = function() {
                if (streamRef) {
                    streamRef.getTracks().forEach(function(track) {
                        track.stop(); // Stop each track to end the stream
                    });
                }
                var videoElement = document.getElementById('sharedScreen');
                videoElement.style.display = 'none'; // Hide the video element
                videoElement.srcObject = null;
            };

            ctrl.captureScreen = function() {
                $timeout(function() { // Use $timeout for the delay
                    var videoElement = document.getElementById('sharedScreen');
                    if (videoElement.srcObject) { // Check if there is a stream
                        var canvas = document.createElement('canvas');
                        canvas.width = videoElement.videoWidth;
                        canvas.height = videoElement.videoHeight;
                        var ctx = canvas.getContext('2d');
                        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                        var imgElement = document.getElementById('screenshotImg');
                        imgElement.src = canvas.toDataURL();
                    } else {
                        alert('No screen is being shared.');
                    }
                }, 5000); // Delay of 5 seconds
            };
        }]);
}());
