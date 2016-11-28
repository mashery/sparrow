// Run script initializations when the Portal is ready
portalReady(function () {
    astro.init();
    clickToHighlight.init();
    fluidvids.init({
        selector: ['iframe', 'object'], // runs querySelectorAll()
        players: ['www.youtube.com', 'player.vimeo.com'] // players to support
    });
    houdini.init();
    modals.init();
    rightHeight.init();
    smoothScroll.init();
    stickyFooter.init();
    tabby.init();
    addTableHeaders();
});