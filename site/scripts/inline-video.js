(() => {
  let activeVideo;
  function closeVideo(restoreFocus = false) {
    if (!activeVideo) return;
    const { player, trigger, closeButton } = activeVideo;
    player.remove();
    closeButton.remove();
    trigger.hidden = false;
    if (restoreFocus) trigger.focus({ preventScroll: true });
    activeVideo = null;
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('button[data-video-id]');
    if (!trigger) return;
    closeVideo();
    const player = document.createElement('iframe');
    const id = trigger.dataset.videoId;
    player.title = trigger.dataset.videoTitle;
    player.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
    player.allowFullscreen = true;
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    player.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&playsinline=1&rel=0';
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'inline-video-close';
    closeButton.textContent = '動画を閉じる';
    closeButton.addEventListener('click', () => closeVideo(true));
    trigger.hidden = true;
    trigger.after(player, closeButton);
    activeVideo = { player, trigger, closeButton };
    player.focus({ preventScroll: true });
    document.dispatchEvent(new CustomEvent('site-video-select', { detail: { id } }));
  });
})();
