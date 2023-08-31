// Custom Cursor

const customCursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
    customCursor.style.left = `${e.clientX}px`;
    customCursor.style.top = `${e.clientY}px`;
});

document.addEventListener('mouseenter', () => {
    customCursor.style.opacity = 1;
});

document.addEventListener('mouseleave', () => {
    customCursor.style.opacity = 0;
});

document.addEventListener('mousedown', (e) => {
    customCursor.style.background = "url('cursor-down.png')";
});

document.addEventListener('mouseup', () => {
    customCursor.style.background = "url('cursor.png')";
});

// Input field from Scrimba Tutorial

// Initialize an array to store bullet points
let myBullets = [];

// Get references to various HTML elements
const inputEl = document.getElementById("input-el");     // Input field for entering bullet points
const inputBtn = document.getElementById("input-btn");   // Button to add a new bullet point
const ulEl = document.getElementById("ul-el");           // Unordered list to display bullet points
const deleteBtn = document.getElementById("delete-btn"); // Button to delete all bullet points
const bulletsFromLocalStorage = JSON.parse(localStorage.getItem("myBullets")); // Retrieve saved bullet points from local storage
const clipboardBtn = document.getElementById("clipboard-btn");       // Button to add the current clipboard as a bullet point

// If there are saved bullet points in local storage, populate the array and render them
if (bulletsFromLocalStorage) {
    myBullets = bulletsFromLocalStorage;
    renderList(myBullets);
}

// Event listener for the "Clipboard" button
clipboardBtn.addEventListener("click", async function() {
    console.log("clipboardBtn clicked!");
    try {
        const clipboardData = await navigator.clipboard.read();

        // Extract text from ClipboardItem (assuming plain text)
        for (const item of clipboardData) {
            for (const type of item.types) {
                if (type === "text/plain") {
                    const blob = await item.getType(type); // Get Blob data
                    const text = await blob.text(); // Convert Blob to plain text
                    myBullets.push(text); // Push plain text to array
                }
            }
        }

        // Save the updated array to local storage
        localStorage.setItem("myBullets", JSON.stringify(myBullets));
        // Render the updated array
        renderList(myBullets);
    } catch (error) {
        console.error("Error reading clipboard:", error);
    }
});


// Function to render bullet points in the HTML
function renderList(bulletPoints) {
    console.log("renderList() has been run!");
    let listItems = "";
    // Loop through each bullet point and create a list item with a link
    for (let i = 0; i < bulletPoints.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${bulletPoints[i]}'>
                    ${bulletPoints[i]}
                </a>
            </li>
        `;
    }
    // Update the HTML content of the unordered list with the generated list items
    ulEl.innerHTML = listItems;
}

// Event listener for the "Delete" button (double click)
deleteBtn.addEventListener("dblclick", function() {
    console.log("deleteBtn clicked!");
    // Clear local storage and reset the array of bullet points
    localStorage.clear();
    myBullets = [];
    // Render the empty array
    renderList(myBullets);
});

// Event listener for the "Add" button
inputBtn.addEventListener("click", function() {
    console.log("inputBtn clicked!");
    const inputValue = inputEl.value.trim(); // Trim leading and trailing whitespace
    if (inputValue !== "") { // Check if the input is not empty
        myBullets.push(inputValue);
        inputEl.value = "";
        // Save the updated array to local storage and render it
        localStorage.setItem("myBullets", JSON.stringify(myBullets));
        renderList(myBullets);
    } else {
        alert("Input is empty!")
    }
});

document.addEventListener("keypress", function(event) {
    if (event.keyCode === 13) { // Check if the pressed key is Enter (key code 13)
        console.log("Enter clicked!");
        const inputValue = inputEl.value.trim(); // Trim leading and trailing whitespace
        if (inputValue !== "") { // Check if the input is not empty
            myBullets.push(inputValue);
            inputEl.value = "";
            // Save the updated array to local storage and render it
            localStorage.setItem("myBullets", JSON.stringify(myBullets));
            renderList(myBullets);
        } else {
            alert("Input is empty!")
        }
    }
});

/* 

ThreeJs custom waves
Original script by ThreeJS : https://threejs.org/examples/canvas_particles_waves.html
Modified version for Cloudoru by Kevin Rajaram : http://kevinrajaram.com
Date: 08/14/2014


*/

var SEPARATION = 70, AMOUNTX = 100, AMOUNTY = 10;

var container;
var camera, scene, renderLister;
/*

if (window.WebGLRenderingContext){
	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	}
else {
	renderer = new THREE.CanvasRenderer();
	}
*/

var particles, particle, count = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);
    if (container) {
        container.className += container.className ? ' waves' : 'waves';
    }

    camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 1, 10000);

	camera.position.y = 300; //changes how far back you can see i.e the particles towards horizon
	camera.position.z = 20; //This is how close or far the particles are seen
	
	camera.rotation.x = 0.35;
	
	scene = new THREE.Scene();

	particles = new Array();

	var PI2 = Math.PI * 2;
    var material = new THREE.SpriteMaterial({
        color: 0xffffff, // changes color of particles
        map: new THREE.CanvasTexture(generateSprite()) // Call your sprite generation function here
    });
	var i = 0;

	for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

		for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

			particle = particles[ i ++ ] = new THREE.Sprite( material );
			particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
			particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) - 10 );
			scene.add( particle );

		}

	}

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('waves-canvas') });
    renderer.setSize(window.innerWidth, window.innerHeight);
	//renderer.setClearColor( 0xEAEBE5, 1);
  renderer.setClearColor( 0x0a0a0a, 1);
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

}

function generateSprite() {
    const canvas = document.createElement('canvas');
    const size = 64; // You can adjust the size of the texture here
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');

    context.beginPath();
    context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    context.fillStyle = '#ffffff'; // Circle color
    context.fill();

    return canvas;
}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	requestAnimationFrame( animate );

	render();

}

function render() {

	var i = 0;

	for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

		for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

			particle = particles[ i++ ];
			particle.position.y = ( Math.sin( ( ix + count ) * 0.5 ) * 15 ) + ( Math.sin( ( iy + count ) * 0.5 ) * 15 );
			particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.5 ) + 2 ) * 4 + ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 4;

		}

	}

	renderer.render( scene, camera );

	// This increases or decreases speed
	count += 0.005;

}

// Clock

function updateDateTime() {
    // Get references to the date-time element
    const dateTimeElement = document.getElementById("date-time");

    // Function to get the ordinal suffix for a number (e.g., 1st, 2nd, 3rd)
    function getOrdinalSuffix(number) {
        const suffixes = ["th", "st", "nd", "rd"];
        const remainder = number % 100;
        return number + (suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]);
    }

    // Array of month names
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Array of day names
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Get the current date and time
    const now = new Date();
    const dayOfTheWeek = dayNames[now.getDay()];
    const dayOfMonth = now.getDate();
    const month = monthNames[now.getMonth()];
    const xth = getOrdinalSuffix(dayOfMonth);
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Use the checkTime function to format numbers with leading zeros
    function checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    // Format the time using the checkTime function
    const formattedTime = `${checkTime(hours)}:${checkTime(minutes)}:${checkTime(seconds)}`;

    // Construct the final message
    const message = `Today is ${dayOfTheWeek} the ${xth} of ${month}. The local time is ${formattedTime}`;

    // Update the content of the date-time element
    dateTimeElement.textContent = message;

    // Request the next animation frame
    requestAnimationFrame(updateDateTime);
}

// Initial call to start the clock
updateDateTime();