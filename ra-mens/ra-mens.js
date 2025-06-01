let map;
let service;
let infowindow;

window.initApp = function () {
  // 現在地の取得
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const userLat = pos.coords.latitude;
      const userLng = pos.coords.longitude;

      initMap(userLat, userLng);

      document.getElementById("searchBtn").addEventListener("click", () => {
        searchNearby(userLat, userLng);
        document.getElementById("store-list").style.display = "flex";
      });
    },
    () => {
      alert("位置情報の取得に失敗しました。");
    }
  );
};

// Google Maps APIスクリプトを動的に読み込み
fetch("/api/key")
  .then((res) => res.json())
  .then((data) => {
    if (!data.key) throw new Error("APIキーの取得に失敗しました");

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${data.key}&libraries=places`;
    script.defer = true;
    script.async = true;
    script.onload = () => {
      window.initApp && window.initApp();
    };
    document.head.appendChild(script);
  })
  .catch((err) => {
    alert("Google Maps APIの読み込みに失敗しました。");
    console.error(err);
  });

// 地図初期化
function initMap(lat, lng) {
  const location = new google.maps.LatLng(lat, lng);
  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById("map"), {
    center: location,
    zoom: 15,
  });

  new google.maps.Marker({
    position: location,
    map: map,
    title: "あなたの現在地",
    icon: {
      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
    }
  });
}

// 近くのラーメン店検索
function searchNearby(lat, lng) {
  const location = new google.maps.LatLng(lat, lng);

  const request = {
    location: location,
    radius: '1000',
    keyword: 'ラーメン',
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      displayResults(results);
    } else {
      alert("ラーメン店の検索に失敗しました。");
    }
  });
}

// 結果を表示
function displayResults(results) {
  const list = document.getElementById("store-list");
  list.innerHTML = "";

  results.forEach((place) => {
    const li = document.createElement("li");
    li.textContent = place.name;
    list.appendChild(li);

    // マーカー追加
    const marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      title: place.name,
    });

    marker.addListener("click", () => {
      infowindow.setContent(`<strong>${place.name}</strong><br>${place.vicinity}`);
      infowindow.open(map, marker);
    });
  });
}
