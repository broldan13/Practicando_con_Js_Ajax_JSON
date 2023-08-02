<?php

if(isset($_POST)){
    $name = $_POST["name"];
    $email = $_POST["email"];
    $subject = $_POST["subject"];
    $comments = $_POST["comments"];

    $domain = $_SERVER["HTTP_HOST"];
    $to = "lecterdante8@gmail.com";
    $subject_mail = "Contacto desde el formulario $domain.";
    $message = `
    <p>Datos enviados desde el dormulario $domain</p>
    <ul>
        <li>Nombre: $name </li>
        <li>Email: $email </li>
        <li>Asunto: $subject </li>
        <li>Comentarios: $comments</li>
    </ul>
    `;

    $headers = "MIME-Version: 1.0\r\n"."Content-Type: text/html;charset=uft-8\r\n"."From: Envío automatico No Responder <no-reply@$domain>";

    $send_mail= mail($to, $subject_mail, $message, $headers);

    if ($send_mail){
        $reply =[
            "error"=> false,
            "message" => "Tus datos de enviarón correctamente"
        ];
    }else{
        $reply=[
            "error"=> true,
            "message"=> "Error al enviar el formulario"
        ];
    };

    header("Access-Control-Allow-Origin:*");
    header(`Content-type:application/json`);
    echo json_encode($reply);
    exit;
}