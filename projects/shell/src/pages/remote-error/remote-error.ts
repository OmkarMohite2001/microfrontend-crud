import { Component, input } from '@angular/core';

@Component({
  selector: 'app-remote-error',
  imports: [],
  template: `
    <div class="remote-error-container">
      <div class="error-card">
        <div class="error-icon">⚡</div>
        <h2 class="error-title">Unable to Connect to {{ remoteName() }}</h2>
        <p class="error-desc">
          The host shell could not load the remote module from
          <code>http://localhost:{{ port() }}/remoteEntry.json</code>.
        </p>

        <div class="instructions-box">
          <span class="inst-label">How to resolve:</span>
          <p class="inst-text">
            Ensure the microfrontend application is running on port <strong>{{ port() }}</strong>.
          </p>
          <div class="command-box">
            <code>npm run {{ scriptName() }}</code>
          </div>
          <p class="inst-note">Or start all microfrontends at once using <code>npm run start:all</code>.</p>
        </div>

        <button type="button" class="btn-retry" (click)="reloadPage()">
          🔄 Retry Connection
        </button>
      </div>
    </div>
  `,
  styles: [`
    .remote-error-container {
      padding: 40px 20px;
      display: flex;
      justify-content: center;
    }
    .error-card {
      background: #ffffff;
      border: 1px solid #fee2e2;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      padding: 36px;
      max-width: 580px;
      width: 100%;
      text-align: center;
    }
    .error-icon {
      font-size: 40px;
      margin-bottom: 12px;
    }
    .error-title {
      font-size: 20px;
      font-weight: 700;
      color: #991b1b;
      margin: 0 0 10px 0;
    }
    .error-desc {
      font-size: 14px;
      color: #475569;
      line-height: 1.5;
      margin: 0 0 20px 0;
    }
    code {
      background-color: #f1f5f9;
      color: #0f172a;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 13px;
    }
    .instructions-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      text-align: left;
      margin-bottom: 24px;
    }
    .inst-label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }
    .inst-text {
      font-size: 13px;
      color: #1e293b;
      margin: 0 0 10px 0;
    }
    .command-box {
      background-color: #0f172a;
      color: #4ade80;
      padding: 10px 14px;
      border-radius: 6px;
      font-family: monospace;
      font-size: 14px;
      margin-bottom: 8px;
      code {
        background: transparent;
        color: #4ade80;
        padding: 0;
      }
    }
    .inst-note {
      font-size: 12px;
      color: #64748b;
      margin: 0;
    }
    .btn-retry {
      background-color: #2563eb;
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.15s ease;
      &:hover {
        background-color: #1d4ed8;
      }
    }
  `],
})
export class RemoteErrorComponent {
  readonly remoteName = input<string>('Remote Microfrontend');
  readonly port = input<number>(4201);
  readonly scriptName = input<string>('start:vehicle');

  reloadPage(): void {
    window.location.reload();
  }
}

export function remoteErrorRoutes(remoteName: string, port: number, scriptName: string) {
  return [
    {
      path: '',
      component: RemoteErrorComponent,
      inputs: { remoteName, port, scriptName },
    },
    {
      path: '**',
      component: RemoteErrorComponent,
      inputs: { remoteName, port, scriptName },
    },
  ];
}
