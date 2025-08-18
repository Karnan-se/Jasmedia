export const contactEmailTemplate = (name, email, phoneNumber, message) => `
  <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    
    <h2 style="text-align: center; color: #333; margin-bottom: 20px;">Contact Form Submission</h2>

    <div style="margin-bottom: 15px;">
      <div style="font-weight: bold; margin-bottom: 5px; color: #555;">Name</div>
      <div style="padding: 10px; background: #f0f0f0; border-radius: 5px; color: #333;">${name}</div>
    </div>

    <div style="margin-bottom: 15px;">
      <div style="font-weight: bold; margin-bottom: 5px; color: #555;">Email</div>
      <div style="padding: 10px; background: #f0f0f0; border-radius: 5px; color: #333;">${email}</div>
    </div>

    <div style="margin-bottom: 15px;">
      <div style="font-weight: bold; margin-bottom: 5px; color: #555;">Phone Number</div>
      <div style="padding: 10px; background: #f0f0f0; border-radius: 5px; color: #333;">${phoneNumber}</div>
    </div>

    <div style="margin-bottom: 15px;">
      <div style="font-weight: bold; margin-bottom: 5px; color: #555;">Message</div>
      <div style="padding: 10px; background: #f0f0f0; border-radius: 5px; color: #333;">
        ${message}
      </div>
    </div>

  </div>
    `;
