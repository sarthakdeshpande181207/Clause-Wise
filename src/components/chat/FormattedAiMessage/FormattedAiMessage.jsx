import { useMemo } from 'react';
import { FileText, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import styles from './FormattedAiMessage.module.css';

/**
 * Formats inline bold text like **bold** into <strong> tags safely
 */
function renderInlineText(text) {
  if (!text) return null;
  
  // Split by ** delimiters
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className={styles.boldText}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

/**
 * Parses Gemini output text into structured sections (intro, clause blocks, bullet points)
 */
function parseAiText(rawText) {
  if (!rawText) return { intro: '', blocks: [] };

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const blocks = [];
  let currentBlock = null;
  let intro = '';

  // Regex patterns to identify clause headers
  // E.g.: "1. **Clause Title**", "**कलाम १: ...**", "### Clause 1", "Section 1:"
  const headerRegex = /^(?:(?:\d+\.|\*|-)\s*)?(?:\*\*)?(?:कलम|धारा|Section|Clause|\d+\.)\s*[\d૧૨૩૪૫૬૭૮૯૦१२३४५६७८९०]+[.:\-]?\s*([^*]+)(?:\*\*)?$/i;
  const boldHeaderRegex = /^\*\*(?:कलम|धारा|Section|Clause|\d+\.)[^:*]+\*\*/i;

  for (const line of lines) {
    // Check if line looks like a main clause header
    const isMainHeader = line.startsWith('###') || 
                        line.startsWith('##') || 
                        boldHeaderRegex.test(line) || 
                        headerRegex.test(line);

    if (isMainHeader) {
      if (currentBlock) {
        blocks.push(currentBlock);
      }
      currentBlock = {
        title: line.replace(/^#+\s*/, ''),
        content: [],
        items: []
      };
    } else if (currentBlock) {
      // Check if line is a bullet item (1., 2., -, *)
      const itemMatch = line.match(/^(?:[\d૧૨૩૪૫૬૭૮૯૦१२३४५६७८९०]+\.|\*|-)\s+(.*)/);
      if (itemMatch) {
        currentBlock.items.push(itemMatch[1]);
      } else {
        currentBlock.content.push(line);
      }
    } else {
      intro += (intro ? ' ' : '') + line;
    }
  }

  if (currentBlock) {
    blocks.push(currentBlock);
  }

  // Fallback: If no structured blocks were parsed, split by double newlines or numbered lines
  if (blocks.length === 0 && rawText.includes('**')) {
    const rawBlocks = rawText.split(/(?=\d+\.\s*\*\*|\*\*(?:कलम|धारा|Section|Clause))/gi);
    if (rawBlocks.length > 1) {
      intro = rawBlocks[0].trim();
      for (let i = 1; i < rawBlocks.length; i++) {
        const bText = rawBlocks[i].trim();
        const firstLineEnd = bText.indexOf('\n');
        let title = firstLineEnd !== -1 ? bText.slice(0, firstLineEnd) : bText;
        let rest = firstLineEnd !== -1 ? bText.slice(firstLineEnd + 1) : '';

        // Extract bullet items from rest
        const restLines = rest.split('\n').map(l => l.trim()).filter(Boolean);
        const contentLines = [];
        const itemLines = [];

        for (const rLine of restLines) {
          const m = rLine.match(/^(?:[\d૧૨૩૪૫૬૭૮૯૦१२३४५६७८९०]+\.|\*|-)\s+(.*)/);
          if (m) itemLines.push(m[1]);
          else contentLines.push(rLine);
        }

        blocks.push({
          title,
          content: contentLines,
          items: itemLines
        });
      }
    }
  }

  return { intro, blocks };
}

export default function FormattedAiMessage({ text }) {
  const { intro, blocks } = useMemo(() => parseAiText(text), [text]);

  // If simple response without structured blocks, render clean paragraphs with inline bolding
  if (blocks.length === 0) {
    const paragraphs = text.split('\n\n').filter(Boolean);
    return (
      <div className={styles.simpleText}>
        {paragraphs.map((p, idx) => (
          <p key={idx} className={styles.paragraph}>
            {renderInlineText(p)}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.structuredContainer}>
      {/* Intro statement if present */}
      {intro && (
        <div className={styles.introBox}>
          <p className={styles.introText}>{renderInlineText(intro)}</p>
        </div>
      )}

      {/* Clause-wise Structured Mini-Cards */}
      <div className={styles.blocksList}>
        {blocks.map((block, idx) => (
          <div key={idx} className={styles.clauseCard}>
            <div className={styles.cardHeader}>
              <FileText size={15} className={styles.headerIcon} />
              <h4 className={styles.cardTitle}>
                {renderInlineText(block.title)}
              </h4>
            </div>

            {block.content.length > 0 && (
              <div className={styles.cardBody}>
                {block.content.map((p, pIdx) => (
                  <p key={pIdx} className={styles.bodyParagraph}>
                    {renderInlineText(p)}
                  </p>
                ))}
              </div>
            )}

            {block.items.length > 0 && (
              <ul className={styles.itemsList}>
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className={styles.itemRow}>
                    <span className={styles.itemBullet}>•</span>
                    <div className={styles.itemContent}>
                      {renderInlineText(item)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
