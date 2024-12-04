var app = angular.module('indexApp', []);

app.controller('IndexController', ['$scope', function($scope) {
    $scope.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true')
        .then(response => response.json())
        .then(data => {
            const agentsList = document.querySelector('.agents__list');
            data.data.forEach(agent => {
                const abilities = agent.abilities.map(ability => {
                    return {
                        displayName: ability.displayName,
                        description: ability.description,
                        displayIcon: ability.displayIcon
                    };
                });

                const agentData = JSON.stringify(agent).replace(/'/g, "&apos;").replace(/"/g, "&quot;");

                const agentElement = `
                    <div class="agents__element" data-agent-data='${agentData}'>
                        <p class="agents__element__title">${agent.displayName}</p>
                        <p class="agents__element__subtitle">${agent.developerName}</p>
                        <img class="agents__element__icon" src="${agent.fullPortrait}" alt="${agent.displayName}">
                        <div class="agents__element__abilities">
                            ${abilities.slice(0, 4).map(ability => `<img src="${ability.displayIcon}" alt="${ability.displayName}" title="${ability.description}">`).join('')}
                        </div>
                    </div>
                `;
                agentsList.innerHTML += agentElement;
            });
        })
        .catch(error => console.error('Error fetching agents:', error));

    $scope.logout = function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    };
}]);

document.addEventListener('DOMContentLoaded', () => {
    const agentsList = document.querySelector('.agents__list');

    agentsList.addEventListener('click', (event) => {
        const agentElement = event.target.closest('.agents__element');
        if (agentElement) {
            document.querySelectorAll('.agents__element').forEach(element => {
                element.classList.remove('selected');
            });
            agentElement.classList.add('selected');

            const agentData = JSON.parse(agentElement.dataset.agentData.replace(/&apos;/g, "'").replace(/&quot;/g, '"'));
            const abilities = agentData.abilities.map((ability, index) => {
                const description = ability.description.length > 100 
                    ? ability.description.substring(0, 100) + '...' 
                    : ability.description;
                return `
                    <div class="abilities__element" data-index="${index}">
                        <div class="abilities__element__info">
                            <div class="abilities__element__title">${ability.slot}</div>
                            <div class="abilities__element__subtitle">${ability.displayName}</div>
                            <div class="abilities__element__description">${description}</div>
                        </div>
                        <img src="${ability.displayIcon}" alt="${ability.displayName}" class="abilities__element__icon" style="-webkit-filter: invert(1); filter: invert(1);">
                        <div class="abilities__element__rectangle"></div>
                    </div>
                `;
            });

            let abilitiesSection = document.querySelector('.abilities');
            if (!abilitiesSection) {
                abilitiesSection = document.createElement('section');
                abilitiesSection.classList.add('abilities');
                abilitiesSection.innerHTML = '<div class="abilities__container"></div>';
                document.querySelector('main').appendChild(abilitiesSection);
            }

            const abilitiesContainer = abilitiesSection.querySelector('.abilities__container');
            abilitiesContainer.innerHTML = abilities.slice(0, 3).join('');

            const arrowElement = `
                <div class="abilities__arrow">
                    <img src="../images/Polygon.svg" alt="">
                </div>
            `;
            abilitiesContainer.innerHTML += arrowElement;

            let currentIndex = 0;

            const updateAbilities = () => {
                const currentElements = abilitiesContainer.querySelectorAll('.abilities__element');
                currentElements.forEach(element => element.classList.add('slide-out'));

                setTimeout(() => {
                    currentIndex = (currentIndex + 1) % abilities.length;
                    const nextAbilities = abilities.slice(currentIndex, currentIndex + 3);
                    if (nextAbilities.length < 3) {
                        nextAbilities.push(...abilities.slice(0, 3 - nextAbilities.length));
                    }
                    abilitiesContainer.innerHTML = nextAbilities.join('') + arrowElement;
                    const newElements = abilitiesContainer.querySelectorAll('.abilities__element');
                    newElements.forEach(element => element.classList.add('slide-in'));

                    abilitiesContainer.querySelector('.abilities__arrow').addEventListener('click', updateAbilities);
                }, 300); 
            };

            abilitiesContainer.querySelector('.abilities__arrow').addEventListener('click', updateAbilities);

            setTimeout(() => {
                abilitiesSection.classList.add('visible');
            }, 50);
        }
    });
});