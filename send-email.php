<?php
// ============================================
// NZUMBI FOUNDATION CONTACT FORM
// ============================================

// Error reporting (disable for production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Enable detailed error logging
ini_set('log_errors', 1);
ini_set('error_log', 'contact_form_errors.log');

// Set timezone
date_default_timezone_set('Africa/Nairobi');

// ============================================
// CONFIGURATION - EDIT THESE VALUES
// ============================================

// Email configuration
$recipient_email = 'info@nzumbifoundation.or.ke'; // Your main email
$recipient_name = 'Nzumbi Foundation';
$website_name = 'Nzumbi Foundation Website';
$sender_email = 'noreply@tiptipparty.co.ke'; // Use your domain email

// SMTP Configuration (Optional - only if mail() doesn't work)
$use_smtp = false; // Set to true if you want to use SMTP
$smtp_host = 'mail.tiptipparty.co.ke';
$smtp_port = 465;
$smtp_username = '_mainaccount@tiptipparty.co.ke';
$smtp_password = 'YOUR_CPANEL_PASSWORD'; // Your actual password

// ============================================
// FUNCTIONS
// ============================================

/**
 * Validate and sanitize form data
 */
function validateFormData($post) {
    $errors = [];
    $data = [];
    
    // Name validation
    if (empty($post['name'])) {
        $errors[] = 'Name is required';
    } else {
        $data['name'] = filter_var(trim($post['name']), FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW);
        if (empty($data['name'])) {
            $errors[] = 'Please enter a valid name';
        }
    }
    
    // Email validation
    if (empty($post['email'])) {
        $errors[] = 'Email is required';
    } else {
        $data['email'] = filter_var(trim($post['email']), FILTER_SANITIZE_EMAIL);
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Please enter a valid email address';
        }
    }
    
    // Phone (optional)
    $data['phone'] = !empty($post['phone']) ? filter_var(trim($post['phone']), FILTER_SANITIZE_STRING) : '';
    
    // Subject validation
    if (empty($post['subject'])) {
        $errors[] = 'Subject is required';
    } else {
        $data['subject'] = filter_var(trim($post['subject']), FILTER_SANITIZE_STRING);
    }
    
    // Message validation
    if (empty($post['message'])) {
        $errors[] = 'Message is required';
    } else {
        $data['message'] = filter_var(trim($post['message']), FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW);
        if (strlen($data['message']) < 10) {
            $errors[] = 'Message should be at least 10 characters long';
        }
    }
    
    // Newsletter (optional checkbox)
    $data['newsletter'] = isset($post['newsletter']) ? 'Yes' : 'No';
    
    // Timestamp
    $data['timestamp'] = date('Y-m-d H:i:s');
    
    // IP address
    $data['ip'] = $_SERVER['REMOTE_ADDR'];
    
    return [
        'errors' => $errors,
        'data' => $data
    ];
}

/**
 * Method 1: Using PHP's built-in mail() function (works on most cPanel hosts)
 */
function sendEmailWithMailFunction($data, $recipient_email, $recipient_name, $sender_email, $website_name) {
    
    // Email headers
    $headers = "From: $website_name <$sender_email>\r\n";
    $headers .= "Reply-To: {$data['email']}\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Email subject
    $subject = "NZUMBI FOUNDATION: New Contact Form - " . $data['subject'];
    
    // Email body (HTML)
    $body = '<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Contact Form Submission</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .field { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #2c3e50; display: block; margin-bottom: 5px; font-size: 14px; }
            .value { color: #555; }
            .footer { background: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee; }
            .highlight { background-color: #fff3cd; padding: 10px; border-radius: 4px; margin: 15px 0; border-left: 4px solid #ffc107; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Nzumbi Foundation - Contact Form Submission</h2>
                <p>New message received from website contact form</p>
            </div>
            <div class="content">
                <div class="field">
                    <span class="label">From:</span>
                    <span class="value">' . htmlspecialchars($data['name']) . ' &lt;' . htmlspecialchars($data['email']) . '&gt;</span>
                </div>
                
                <div class="field">
                    <span class="label">Phone:</span>
                    <span class="value">' . ($data['phone'] ? htmlspecialchars($data['phone']) : 'Not provided') . '</span>
                </div>
                
                <div class="field">
                    <span class="label">Subject:</span>
                    <span class="value">' . htmlspecialchars($data['subject']) . '</span>
                </div>
                
                <div class="field">
                    <span class="label">Message:</span>
                    <div class="value" style="white-space: pre-line; background: #f8f9fa; padding: 15px; border-radius: 4px; margin-top: 10px;">' . nl2br(htmlspecialchars($data['message'])) . '</div>
                </div>
                
                <div class="field">
                    <span class="label">Newsletter Subscription:</span>
                    <span class="value">' . $data['newsletter'] . '</span>
                </div>
                
                <div class="highlight">
                    <strong>Submission Details:</strong><br>
                    Date: ' . $data['timestamp'] . '<br>
                    IP Address: ' . $data['ip'] . '
                </div>
            </div>
            <div class="footer">
                <p>This email was automatically generated from the contact form on Nzumbi Foundation website.</p>
                <p>Do not reply to this email. Use the reply-to address above to contact the sender.</p>
            </div>
        </div>
    </body>
    </html>';
    
    // Send email using mail() function
    if (mail($recipient_email, $subject, $body, $headers)) {
        // Also send auto-reply to the sender
        sendAutoReply($data, $sender_email, $website_name);
        return true;
    }
    
    return false;
}

/**
 * Send auto-reply to the person who filled the form
 */
function sendAutoReply($data, $sender_email, $website_name) {
    $auto_subject = "Thank you for contacting Nzumbi Foundation";
    
    $auto_headers = "From: Nzumbi Foundation <$sender_email>\r\n";
    $auto_headers .= "MIME-Version: 1.0\r\n";
    $auto_headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    
    $auto_body = '<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Thank You for Contacting Nzumbi Foundation</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .footer { background: #eee; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Thank You for Contacting Nzumbi Foundation</h2>
            </div>
            <div class="content">
                <p>Dear ' . htmlspecialchars($data['name']) . ',</p>
                
                <p>Thank you for getting in touch with Nzumbi Foundation. We have received your message and our team will review it shortly.</p>
                
                <p><strong>Here\'s a summary of your inquiry:</strong></p>
                <ul>
                    <li><strong>Subject:</strong> ' . htmlspecialchars($data['subject']) . '</li>
                    <li><strong>Submitted on:</strong> ' . $data['timestamp'] . '</li>
                </ul>
                
                <p>We strive to respond to all inquiries within 24-48 hours during business days (Monday to Friday, 8:00 AM - 5:00 PM EAT).</p>
                
                <div class="signature">
                    <p><strong>Best regards,</strong><br>
                    The Nzumbi Foundation Team<br>
                    Makueni County, Kenya<br>
                    Email: info@nzumbifoundation.or.ke<br>
                    Phone: +254 723 000 000</p>
                </div>
            </div>
            <div class="footer">
                <p>This is an automated response. Please do not reply to this email.</p>
                <p>If you need immediate assistance, please call us at +254 723 000 000.</p>
            </div>
        </div>
    </body>
    </html>';
    
    mail($data['email'], $auto_subject, $auto_body, $auto_headers);
}

/**
 * Save form submission to a text file (as backup)
 */
function saveToFile($data) {
    $log_file = 'contact_submissions.txt';
    $log_entry = "===========================================\n";
    $log_entry .= "Date: " . $data['timestamp'] . "\n";
    $log_entry .= "IP: " . $data['ip'] . "\n";
    $log_entry .= "Name: " . $data['name'] . "\n";
    $log_entry .= "Email: " . $data['email'] . "\n";
    $log_entry .= "Phone: " . $data['phone'] . "\n";
    $log_entry .= "Subject: " . $data['subject'] . "\n";
    $log_entry .= "Message: " . $data['message'] . "\n";
    $log_entry .= "Newsletter: " . $data['newsletter'] . "\n";
    $log_entry .= "===========================================\n\n";
    
    file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);
}

// ============================================
// MAIN PROCESSING
// ============================================

// Set response header
header('Content-Type: application/json');

// Check if this is a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
    exit;
}

// Validate form data
$validation = validateFormData($_POST);
$errors = $validation['errors'];
$formData = $validation['data'];

// If there are validation errors
if (!empty($errors)) {
    echo json_encode([
        'success' => false,
        'message' => implode('<br>', $errors)
    ]);
    exit;
}

// Try Method 1: Send email using mail() function (works on cPanel)
$email_sent = sendEmailWithMailFunction($formData, $recipient_email, $recipient_name, $sender_email, $website_name);

// If email failed, try alternative method
if (!$email_sent && $use_smtp) {
    // Method 2: Try using SMTP (only if enabled in config)
    require 'PHPMailer/PHPMailer.php';
    require 'PHPMailer/SMTP.php';
    require 'PHPMailer/Exception.php';
    
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = $smtp_host;
        $mail->SMTPAuth = true;
        $mail->Username = $smtp_username;
        $mail->Password = $smtp_password;
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = $smtp_port;
        
        // Recipients
        $mail->setFrom($sender_email, $website_name);
        $mail->addAddress($recipient_email, $recipient_name);
        $mail->addReplyTo($formData['email'], $formData['name']);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = "NZUMBI FOUNDATION: New Contact Form - " . $formData['subject'];
        
        // Email body
        $mail->Body = "New contact form submission from {$formData['name']} ({$formData['email']})<br><br>" .
                     "Phone: " . ($formData['phone'] ?: 'Not provided') . "<br>" .
                     "Subject: {$formData['subject']}<br><br>" .
                     "Message:<br>" . nl2br($formData['message']) . "<br><br>" .
                     "Newsletter Subscription: {$formData['newsletter']}<br>" .
                     "Submitted at: {$formData['timestamp']}";
        
        $mail->AltBody = "New contact form submission from {$formData['name']} ({$formData['email']})\n\n" .
                        "Phone: " . ($formData['phone'] ?: 'Not provided') . "\n" .
                        "Subject: {$formData['subject']}\n\n" .
                        "Message:\n{$formData['message']}\n\n" .
                        "Newsletter Subscription: {$formData['newsletter']}\n" .
                        "Submitted at: {$formData['timestamp']}";
        
        $mail->send();
        $email_sent = true;
        
    } catch (Exception $e) {
        error_log("SMTP Email failed: " . $e->getMessage());
        $email_sent = false;
    }
}

// Save to file as backup
saveToFile($formData);

// Return response
if ($email_sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message! We have received it and will get back to you soon. A confirmation email has been sent to ' . $formData['email']
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Sorry, there was an error sending your message. Please try again later or contact us directly at info@nzumbifoundation.or.ke'
    ]);
}
?>
