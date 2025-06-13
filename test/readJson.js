console.log("eceee")

fetch("tracks\Armageddom\data.json")
  .then((response) => response.json())
  .then((json) => console.log(json));
