app.controller(
    'SimController',
    ['$scope', 'SocketService',
    function($scope, SocketService) {

        const canvas =
            document.getElementById('plasmaCanvas');

        const ctx =
            canvas.getContext('2d');


        $scope.fps = 0;
        $scope.particleCount = 0;
        $scope.lastTick = 0;


        let frameCount = 0;
        let lastFpsCalculation =
            performance.now();


        function render(particles) {

            // Clear canvas
            ctx.fillStyle = '#1A1A24';

            ctx.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );


            // Draw particles
            for (const particle of particles) {

                ctx.beginPath();

                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.radius,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    particle.color;

                ctx.shadowBlur = 8;

                ctx.shadowColor =
                    particle.color;

                ctx.fill();

                ctx.shadowBlur = 0;
            }


            // FPS calculation
            frameCount++;

            const now =
                performance.now();


            if (
                now - lastFpsCalculation
                >= 1000
            ) {

                $scope.$applyAsync(
                    function() {
                        $scope.fps =
                            frameCount;
                    }
                );

                frameCount = 0;

                lastFpsCalculation =
                    now;
            }
        }


        SocketService.on(
            'physics_update',
            function(data) {

                $scope.$applyAsync(
                    function() {

                        $scope.particleCount =
                            data.particles.length;

                        $scope.lastTick =
                            data.tick;
                    }
                );

                render(data.particles);
            }
        );

    }]
);