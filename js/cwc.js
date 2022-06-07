version = '0.1.0';
notation = 'double-face';
on_button = 0;

(function(){
	displayVersion();
	resizeChart();
})();

function displayVersion() {
	document.getElementById('cwc_version').innerHTML = version;
}
