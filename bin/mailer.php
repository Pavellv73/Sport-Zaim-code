<?php

$message = '<h2>Новая заявка с сайта "ДеньгоГрад"</h2>';

if (isset($_POST['name']))
    $message .= '<p>Имя <b>' . $_POST['name'] . '</b></p>';

if (isset($_POST['phone']))
    $message .= '<p>Контактный телефон <b>' . $_POST['phone'] . '</b></p>';

if (isset($_POST['email']))
  $message .= '<p>E-mail <b>' . $_POST['email'] . '</b></p>';



include "class.phpmailer.php";

$mail = new PHPMailer();
$mail->From = $_REQUEST['email'] ? $_REQUEST['email'] : "orders@next-team.ru";
$mail->FromName = $_REQUEST['name'];
$mail->AddAddress('lp@next-team.ru');
$mail->IsHTML(true);
$mail->Subject = "Новая заявка с сайта «ДеньгоГрад»";
$mail->Body = $message;

if (!$mail->Send()) print ('Mailer Error: ' . $mail->ErrorInfo);

?>
