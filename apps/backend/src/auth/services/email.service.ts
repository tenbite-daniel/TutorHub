import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';
    const apiKey = this.configService.get<string>('BREVO_API_KEY');
    const fromAddress =
      this.configService.get<string>('EMAIL_FROM_ADDRESS') ||
      'no-reply@tutorhub.com';
    const fromName =
      this.configService.get<string>('EMAIL_FROM_NAME') ||
      'TutorHub - Ethiopia';

    // Local development fallback: write OTP to terminal if no API key is configured
    if (!apiKey) {
      if (!isProduction) {
        this.logger.warn(
          `[DEV ONLY] BREVO_API_KEY not configured. Password reset OTP for ${email}: ${otp}`,
        );
        return;
      }
      this.logger.error('BREVO_API_KEY is not configured in production.');
      throw new ServiceUnavailableException(
        'Could not send email, please try again later',
      );
    }

    const payload = {
      sender: {
        name: fromName,
        email: fromAddress,
      },
      to: [{ email }],
      subject: 'Password Reset OTP',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You have requested to reset your password. Please use the following OTP:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #333; font-size: 32px; margin: 0;">${otp}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        this.logger.error(
          `Brevo API error [${response.status}]: ${errorBody.slice(0, 200)}`,
        );
        throw new ServiceUnavailableException(
          'Could not send email, please try again later',
        );
      }
    } catch (error) {
      if (error instanceof ServiceUnavailableException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to send email via Brevo: ${message}`);
      throw new ServiceUnavailableException(
        'Could not send email, please try again later',
      );
    }
  }
}