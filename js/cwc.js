version = '0.1.0';
notation = 'double-face';

(function(){
	displayVersion();
	createChart('');
	createChartButton();
})();

function displayVersion() {
	document.getElementById('cwc_version').innerHTML = version;
}
