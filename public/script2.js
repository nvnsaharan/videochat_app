const listForm = document.querySelector('#link-form');
const linkVideo = document.querySelector('#link_video');
const TV_screen = document.querySelector('#iframe');

listForm.addEventListener('submit', (e) => {
	e.preventDefault();
	var link_video = linkVideo.value;
	link_video = String(link_video).split('=');
	TV_screen.src = 'https://www.youtube.com/embed/' + link_video[1];

	console.log(link_video);
});
