import { Readable } from 'node:stream';
import { stringify } from 'csv-stringify';

import type { CsvTransformerService } from '@/link-management/application/services';
import type { Link } from '@/link-management/domain/entities';

export class LinksCsvTransformer implements CsvTransformerService {
  transform(source: AsyncIterable<Link>): Readable {
    const csv = stringify({
      delimiter: ',',
      header: true,
      columns: [
        { key: 'id', header: 'ID' },
        { key: 'shortCode', header: 'Short Code' },
        { key: 'originalUrl', header: 'Original URL' },
        { key: 'accessCount', header: 'Access Count' },
        { key: 'createdAt', header: 'Created At' },
        { key: 'updatedAt', header: 'Updated At' },
      ],
    });

    const readable = Readable.from(this.mapToRows(source));
    readable.pipe(csv);

    return csv;
  }

  private async *mapToRows(source: AsyncIterable<Link>) {
    for await (const link of source) {
      yield {
        id: link.id.toString(),
        shortCode: link.shortCode.value,
        originalUrl: link.originalUrl.value,
        accessCount: link.accessCount,
        createdAt: link.createdAt.toISOString(),
        updatedAt: link.updatedAt?.toString(),
      };
    }
  }
}
