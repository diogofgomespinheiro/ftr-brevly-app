import type { Readable } from 'node:stream';

import type { Link } from '@/link-management/domain/entities';

export interface CsvTransformerService {
  transform(source: AsyncIterable<Link>): Readable;
}
