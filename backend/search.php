<?php
include "config.php";

$keyword = "";

if (isset($_GET['key'])) {
    $keyword = mysqli_real_escape_string($conn, $_GET['key']);
    $sql = "SELECT * FROM pets 
            WHERE name LIKE '%$keyword%' 
            OR type LIKE '%$keyword%' 
            OR description LIKE '%$keyword%'";

    $result = mysqli_query($conn, $sql);
}
?>
<!DOCTYPE html>
<html>
<body>

<h2>Kết quả tìm kiếm: <?= $keyword ?></h2>

<?php
if (!empty($keyword)) {
    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            echo "<p><b>".$row['name']."</b><br>";
            echo "Loại: ".$row['type']."<br>";
            echo "Giá: ".number_format($row['price'])." VNĐ<br>";
            echo $row['description']."</p><hr>";
        }
    } else {
        echo "<p>Không tìm thấy kết quả.</p>";
    }
}
?>

</body>
</html>