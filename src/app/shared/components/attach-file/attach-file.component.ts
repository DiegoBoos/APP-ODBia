import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';

interface StatusValidated {
  ok: boolean;
  message: string;
}

@Component({
  selector: 'app-attach-file',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-[338px] mt-1 items-center rounded">
      <div class="text-center flex-end justify-center items-center">
        @if (loadingFiles()) {
        <div
          class="text-center w-full flex-end px-3 py-2 text-xs font-medium leading-none text-green-800 bg-green-200 rounded-full animate-pulse dark:bg-green-900 dark:text-green-200"
        >
          Cargando archivos...
        </div>
        } @else {
        <label
          class="text-xl text-slate-500 text-center cursor-pointer block mb-0 font-medium dark:text-white underline"
          for="multiple_files"
        >
          Seleccionar Archivos
        </label>
        <span class="text-slate-400 text-sm"
          >Máximo permitido {{ maxSizeInMegaBytes }} Mb</span
        >
        @if (attachedFiles().length>0) {
        <label
          (click)="cleanAttachedFiles()"
          class="text-l text-slate-500 text-center block mb-0 font-medium dark:text-white underline cursor-pointer"
        >
          Limpiar
        </label>

        } }
      </div>

      <input
        (change)="onFileChange($event)"
        class="hidden w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        id="multiple_files"
        type="file"
        [accept]="mimeTypes"
        multiple
      />
      @if (statusValidFilesZize().ok) {

      <ul
        class="h-[250px] overflow-y-auto items-center justify-center mt-2 space-y-1 text-left text-gray-500 dark:text-gray-400"
      >
        @for (file of attachedFiles(); track $index) {

        <li class="text-center items-center space-x-1 rtl:space-x-reverse">
          <span class="w-max ">
            <span class="max-w-50">{{ file.name }}</span>
            <span class="font-semibold text-gray-900 dark:text-white"
              >&nbsp; {{ file.size }}</span
            >
            <span
              (click)="removeFile($index)"
              class="pl-3 cursor-pointer text-lg font-extrabold text-red-600"
              >X</span
            >
          </span>
        </li>
        }
      </ul>
      } @else {
      <label
        class="text-sm text-red-600 text-center block mb-2 font-medium dark:text-white"
      >
        {{ statusValidFilesZize().message }}</label
      >
      }

    </div>
    <div
      class="mt-2 flex items-center p-4 text-sm text-gray-800 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
      role="alert"
    >
      <div>
        <svg
          class="flex-shrink-0 inline w-4 h-4 me-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
          />
        </svg>
        <span class="font-medium">Info !</span> Total Archivos:
        {{ totalFiles }}, Tamaño: {{ totalSizeLetter }}
      </div>
    </div>
  `,
  styles: `

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachFileComponent {
  attachedFiles = signal<File[]>([]);
  loadingFiles = signal<boolean>(false);
  statusValidated: StatusValidated = {
    ok: true,
    message: '',
  };

  @Input({ required: true }) maxSizeInMegaBytes!: number;

  @Input({ required: true }) mimeTypes!: string;

  @Output() public emitAttachedFileEvent = new EventEmitter<File[]>();

  public totalFiles = 0;
  public totalSizeLetter = '';

  public statusValidFilesZize = signal<StatusValidated>({
    ok: true,
    message: '',
  });

  validFilesSize(files: FileList): void {
    // const files: FileList = event.target.files;
    const maxSizeInMegaBytes = this.maxSizeInMegaBytes * 1024 * 1024;

    let totalFilesZize = 0;
    Array.from(files).forEach((file: File) => {
      totalFilesZize += file.size;
    });

    const ok = totalFilesZize <= maxSizeInMegaBytes;

    const message = !ok
      ? `El tamaño de los archivos supera el máximo permitido`
      : '';

    this.statusValidFilesZize.set({ ok, message });
  }

  cleanAttachedFiles() {
    this.attachedFiles.set([]);
    this.emitAttachedFileEvent.emit(this.attachedFiles());
    this.totalFiles = 0;
    this.totalSizeLetter = '';
  }

  onFileChange(event: any): void {
    const files: FileList = event.target.files;

    if (files.length > 0) {
      this.validFilesSize(files);

      if (this.statusValidFilesZize().ok) {
        const attachedFiles: any[] = [];
        const promises: Promise<void>[] = [];

        this.loadingFiles.set(true);

        this.totalFiles = 0;
        let totalSize = 0;

        Array.from(files).forEach((file: File) => {
          totalSize += file.size;
          this.totalFiles++;
          const reader = new FileReader();

          const promise = new Promise<void>((resolve) => {
            reader.onload = (e: any) => {
              try {
                const base64Content: string = e.target.result;

                // const attachedFile: File = {
                //   name: file.name,
                //   base64: base64Content,
                //   size: file.size,
                //   sizeLetter: (file.size / (1000 * 1000)) < 1? `${Math.round((file.size / 1000))} KB`: `${Math.round((file.size / (1000 * 1000)))} MB`
                // };

                // attachedFiles.push(attachedFile);
                attachedFiles.push(file);
                resolve();
              } catch (error) {
                console.log(error);

                reject(error);
              }
            };
          });
          promises.push(promise);

          reader.readAsDataURL(file);
        });

        Promise.all(promises).then(() => {
          this.loadingFiles.set(false);
          this.attachedFiles.set(attachedFiles);

          this.totalSizeLetter =
            totalSize / (1000 * 1000) < 1
              ? `${Math.round(totalSize / 1000)} KB`
              : `${Math.round(totalSize / (1000 * 1000))} MB`;

          this.emitAttachedFileEvent.emit(this.attachedFiles());
        });
      }

      // Limpia el input después de procesar los archivos
      event.target.value = '';
    }
  }

  removeFile(index: number) {
    this.attachedFiles().splice(index, 1);

    let totalSize = 0;
    this.attachedFiles().map((file) => {
      totalSize += file.size;
    });

    this.totalSizeLetter =
      totalSize / (1000 * 1000) < 1
        ? `${Math.round(totalSize / 1000)} KB`
        : `${Math.round(totalSize / (1000 * 1000))} MB`;
    this.totalFiles--;
    this.emitAttachedFileEvent.emit(this.attachedFiles());
  }
}
function reject(error: unknown) {
  throw new Error('Function not implemented.');
}
