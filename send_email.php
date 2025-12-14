<?php
/**
 * NZUMBI FOUNDATION - CONTACT FORM HANDLER
 * 
 * This script handles form submissions and sends emails
 * Make sure to configure your email settings below
 */

// Set headers for JSON response
header('Content-Type: application/json');

// Enable error reporting for debugging (disable in production)
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

// ============================================
// CONFIGURATION
// ============================================

// Your email address where form submissions will be sent
$to_email = "info@nzumbifoundation.org";

// Email subject prefix
$subject_prefix = "Nzumbi Foundation - ";

// From email (usually no-reply@yourdomain.com)
$from_email = "noreply@nzumbifoundation.org";

// From name
$from_name = "Nzumbi Foundation Website";

// Admin CC email (optional - leave empty if not needed)
$cc_email = ""; // Example: "admin@nzumbifoundation.org"

// ============================================
// SECURITY & VALIDATION
// ============================================

// Check if request method is POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method.'
    ]);
    exit;
}

// Honeypot field check (add this hidden field in your HTML form to prevent bots)
if (!empty($_POST['website'])) {
    // Likely a bot submission
    echo json_encode([
        'success' => false,
        'message' => 'Spam detected.'
    ]);
    exit;
}

// Rate limiting (simple implementation)
session_start();
$current_time = time();
$time_limit = 60; // 60 seconds

if (isset($_SESSION['last_submission_time'])) {
    $time_difference = $current_time - $_SESSION['last_submission_time'];
    
    if ($time_difference < $time_limit) {
        echo json_encode([
            'success' => false,
            'message' => 'Please wait before submitting another message.'
        ]);
        exit;
    }
}

// ============================================
// GET AND SANITIZE FORM DATA
// ============================================

function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Get form fields
$name = isset($_POST['name']) ? sanitize_input($_POST['name']) : '';
$email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
$phone = isset($_POST['phone']) ? sanitize_input($_POST['phone']) : '';
$subject = isset($_POST['subject']) ? sanitize_input($_POST['subject']) : '';
$message = isset($_POST['message']) ? sanitize_input($_POST['message']) : '';
$newsletter = isset($_POST['newsletter']) ? true : false;

// ============================================
// VALIDATION
// ============================================

$errors = [];

// Validate name
if (empty($name)) {
    $errors[] = "Name is required.";
} elseif (strlen($name) < 2) {
    $errors[] = "Name must be at least 2 characters long.";
} elseif (strlen($name) > 100) {
    $errors[] = "Name must not exceed 100 characters.";
}

// Validate email
if (empty($email)) {
    $errors[] = "Email is required.";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email format.";
}

// Validate subject
if (empty($subject)) {
    $errors[] = "Subject is required.";
}

// Validate message
if (empty($message)) {
    $errors[] = "Message is required.";
} elseif (strlen($message) < 10) {
    $errors[] = "Message must be at least 10 characters long.";
} elseif (strlen($message) > 5000) {
    $errors[] = "Message must not exceed 5000 characters.";
}

// If there are validation errors, return them
if (!empty($errors)) {
    echo json_encode([
        'success' => false,
        'message' => implode(' ', $errors)
    ]);
    exit;
}

// ============================================
// PREPARE EMAIL
// ============================================

// Email subject
$email_subject = $subject_prefix . $subject;

// Email body (HTML format)
$email_body = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8806CE, #6A05A3); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border: 1px solid #e0e0e0; }
        .field { margin-bottom: 20px; }
        .field-label { font-weight: bold; color: #8806CE; margin-bottom: 5px; }
        .field-value { padding: 10px; background: white; border-left: 3px solid #8806CE; }
        .footer { background: #2C3E50; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; }
        svg { vertical-align: middle; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>
                <svg width='18' height='18' viewBox='0 0 24 24' style='fill:#ffffff;'>
                    <path d='M2 4h20v16H2z'/>
                    <path d='M2 4l10 9 10-9'/>
                </svg>
                New Contact Form Submission
            </h2>
            <p>Nzumbi Foundation Website</p>
        </div>

        <div class='content'>
            <div class='field'>
                <div class='field-label'>
                    <svg width='14' height='14' viewBox='0 0 24 24' style='fill:#8806CE;'>
                        <path d='M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5z'/>
                        <path d='M2 22a10 10 0 0 1 20 0z'/>
                    </svg>
                    Name:
                </div>
                <div class='field-value'>" . htmlspecialchars($name) . "</div>
            </div>

            <div class='field'>
                <div class='field-label'>
                    <svg width='14' height='14' viewBox='0 0 24 24' style='fill:#8806CE;'>
                        <path d='M2 4h20v16H2z'/>
                        <path d='M2 4l10 9 10-9'/>
                    </svg>
                    Email:
                </div>
                <div class='field-value'>
                    <a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a>
                </div>
            </div>

            " . (!empty($phone) ? "
            <div class='field'>
                <div class='field-label'>
                    <svg width='14' height='14' viewBox='0 0 24 24' style='fill:#8806CE;'>
                        <path d='M6 2h12v20H6z'/>
                    </svg>
                    Phone:
                </div>
                <div class='field-value'>" . htmlspecialchars($phone) . "</div>
            </div>
            " : "") . "

            <div class='field'>
                <div class='field-label'>
                    <svg width='14' height='14' viewBox='0 0 24 24' style='fill:#8806CE;'>
                        <path d='M4 3h16v4H4z'/>
                        <path d='M4 7h16v14H4z'/>
                    </svg>
                    Subject:
                </div>
                <div class='field-value'>" . htmlspecialchars($subject) . "</div>
            </div>

            <div class='field'>
                <div class='field-label'>
                    <svg width='14' height='14' viewBox='0 0 24 24' style='fill:#8806CE;'>
                        <path d='M2 2h20v14H6l-4 4z'/>
                    </svg>
                    Message:
                </div>
                <div class='field-value'>" . nl2br(htmlspecialchars($message)) . "</div>
            </div>

            <div class='field'>
                <div class='field-label'>
                    <svg width='14' height='14' viewBox='0 0 24 24' style='fill:#8806CE;'>
                        <path d='M4 4h16v16H4z'/>
                        <path d='M4 8h16'/>
                    </svg>
                    Newsletter Subscription:
                </div>
                <div class='field-value'>" . ($newsletter ? "
                    <svg width='14' height='14' viewBox='0 0 24 24' style='fill:green;'>
                        <path d='M20 6L9 17l-5-5'/>
                    </svg> Yes
                " : "
                    <svg width='14' height='14' viewBox='0 0 24 24' style='fill:red;'>
                        <path d='M6 6l12 12M18 6L6 18'/>
                    </svg> No
                ") . "</div>
            </div>

            <div class='field'>
                <div class='field-label'>
                    <svg width='14' height='14' viewBox='0 0 24 24' style='fill:#8806CE;'>
                        <circle cx='12' cy='12' r='10'/>
                        <path d='M12 6v6l4 2'/>
                    </svg>
                    Submitted:
                </div>
                <div class='field-value'>" . date('F j, Y, g:i a') . "</div>
            </div>
        </div>

        <div class='footer'>
            <p><strong>Nzumbi Foundation</strong></p>
            <p>Transforming Communities in Kenya</p>
            <p style='font-size: 12px; margin-top: 10px;'>This email was sent from the contact form on nzumbifoundation.org</p>
        </div>
    </div>
</body>
</html>
";


// Plain text version
$email_body_plain = "
NEW CONTACT FORM SUBMISSION
Nzumbi Foundation Website
==================================

Name: $name
Email: $email
" . (!empty($phone) ? "Phone: $phone\n" : "") . "
Subject: $subject

Message:
$message

Newsletter Subscription: " . ($newsletter ? "Yes" : "No") . "

Submitted: " . date('F j, Y, g:i a') . "

==================================
This email was sent from the contact form on nzumbifoundation.org
";

// ============================================
// EMAIL HEADERS
// ============================================

// To send HTML mail, the Content-type header must be set
$headers = [];
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/html; charset=UTF-8";
$headers[] = "From: " . $from_name . " <" . $from_email . ">";
$headers[] = "Reply-To: " . $name . " <" . $email . ">";
$headers[] = "X-Mailer: PHP/" . phpversion();

// Add CC if configured
if (!empty($cc_email)) {
    $headers[] = "Cc: " . $cc_email;
}

// ============================================
// SEND EMAIL
// ============================================

try {
    // Attempt to send email
    $mail_sent = mail($to_email, $email_subject, $email_body, implode("\r\n", $headers));
    
    if ($mail_sent) {
        // Update session timestamp
        $_SESSION['last_submission_time'] = $current_time;
        
        // If newsletter subscription is checked, you can add to a database or mailing list here
        if ($newsletter) {
            // Example: Add to database or mailing list
            // add_to_newsletter($email, $name);
        }
        
        // Log successful submission (optional)
        $log_message = date('Y-m-d H:i:s') . " - Email sent successfully to $to_email from $email ($name)\n";
        file_put_contents('contact_log.txt', $log_message, FILE_APPEND);
        
        // Success response
        echo json_encode([
            'success' => true,
            'message' => 'Thank you for contacting us! We will get back to you soon.'
        ]);
    } else {
        // Mail function failed
        throw new Exception('Mail function returned false');
    }
    
} catch (Exception $e) {
    // Log error
    $error_message = date('Y-m-d H:i:s') . " - Email failed: " . $e->getMessage() . "\n";
    file_put_contents('contact_errors.txt', $error_message, FILE_APPEND);
    
    // Error response
    echo json_encode([
        'success' => false,
        'message' => 'Sorry, there was an error sending your message. Please try again or contact us directly at ' . $to_email
    ]);
}

// ============================================
// AUTO-REPLY TO SENDER (Optional)
// ============================================

function send_auto_reply($to_email, $to_name) {
    global $from_email, $from_name;
    
    $reply_subject = "Thank you for contacting Nzumbi Foundation";
    
    $reply_body = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8806CE, #6A05A3); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border: 1px solid #e0e0e0; }
        .footer { background: #2C3E50; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; }
        svg { vertical-align: middle; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>
                <svg width='20' height='20' viewBox='0 0 24 24' style='fill:#ffffff;'>
                    <path d='M12 2l2.9 6 6.6.9-4.8 4.7 1.2 6.6L12 17l-5.9 3.1 1.2-6.6L2.5 8.9l6.6-.9z'/>
                </svg>
                Thank You for Reaching Out!
            </h2>
        </div>

        <div class='content'>
            <p>Dear " . htmlspecialchars($to_name) . ",</p>

            <p>Thank you for contacting <strong>Nzumbi Foundation</strong>. We have received your message and will respond as soon as possible, typically within 24-48 hours.</p>

            <p>If your inquiry is urgent, please feel free to call us at <strong>+254 723 000 000</strong> or reach out via WhatsApp.</p>

            <p>In the meantime, you can learn more about our work at 
                <a href='https://nzumbifoundation.org'>nzumbifoundation.org</a>.
            </p>

            <p><strong>Our Mission:</strong> To transform lives through structured family giving and community partnerships in Makueni County and surrounding regions.</p>

            <p>Best regards,<br>
            <strong>The Nzumbi Foundation Team</strong></p>
        </div>

        <div class='footer'>
            <p><strong>Nzumbi Foundation</strong></p>

            <p>
                <svg width='14' height='14' viewBox='0 0 24 24' style='fill:#ffffff;'>
                    <path d='M12 2C8 2 5 5 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-4-3-7-7-7z'/>
                    <circle cx='12' cy='9' r='2.5'/>
                </svg>
                Makueni County, Kenya
            </p>

            <p>
                <svg width='14' height='14' viewBox='0 0 24 24' style='fill:#ffffff;'>
                    <path d='M2 4h20v16H2z'/>
                    <path d='M2 4l10 9 10-9'/>
                </svg>
                info@nzumbifoundation.org |
                <svg width='14' height='14' viewBox='0 0 24 24' style='fill:#ffffff;'>
                    <path d='M6 2h12v20H6z'/>
                </svg>
                +254 723 000 000
            </p>

            <p style='font-size: 12px; margin-top: 10px;'>Transforming Communities Since 2024</p>
        </div>
    </div>
</body>
</html>
";
    
    $reply_headers = [];
    $reply_headers[] = "MIME-Version: 1.0";
    $reply_headers[] = "Content-Type: text/html; charset=UTF-8";
    $reply_headers[] = "From: " . $from_name . " <" . $from_email . ">";
    
    mail($to_email, $reply_subject, $reply_body, implode("\r\n", $reply_headers));
}

// Uncomment the line below to enable auto-reply
send_auto_reply($email, $name);

?>
