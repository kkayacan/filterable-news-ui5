<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>[Top News]</title>
	<?php
		$offset = strpos($_SERVER['REQUEST_URI'], "?i=");
		if ($offset >= 0) {
			$id = substr($_SERVER['REQUEST_URI'], $offset + 3);
			$constants_string = file_get_contents("model/constants.json");
			$constants = json_decode($constants_string, true);
			$api_url = str_replace("news", "meta/i/" . $id, $constants["api_url"]);
			$meta_string = file_get_contents($api_url);
			$meta = json_decode($meta_string, true);
			echo '<meta property="og:title" content="' . $meta["title"] . '"/>';
			echo '<meta property="og:type" content="website"/>';
			echo '<meta property="og:url" content="' . (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]" . '"/>';
			echo '<meta property="og:image" content="' . $meta["image"] . '"/>';
		}
	?>
	<script
		id="sap-ui-bootstrap"
		src="https://openui5.hana.ondemand.com/1.77.2/resources/sap-ui-core.js"
		data-sap-ui-theme="sap_belize"
		data-sap-ui-resourceroots='{
			"com.fnews.ui5": "./"
		}'
		data-sap-ui-oninit="module:sap/ui/core/ComponentSupport"
		data-sap-ui-compatVersion="edge"
		data-sap-ui-async="true">
	</script>
</head>
<body class="sapUiBody" id="content">
	<div data-sap-ui-component data-name="com.fnews.ui5" data-id="container" data-settings='{"id" : "filterable-news-ui5"}'></div>
</body>
</html>