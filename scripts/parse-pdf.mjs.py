import fitz, re, json, csv

doc = fitz.open('JSF JUNE3.pdf')

# --- 1. price-anchored extraction (cleanest field separation) --------------
rows = []
for pi in range(doc.page_count):
    top = 158 if pi == 0 else 108
    words = [w for w in doc[pi].get_text('words') if top < w[1] < 752]
    anchors = sorted([w for w in words if w[0] > 481 and '$' in w[4]], key=lambda w: w[1])
    if not anchors:
        continue
    ay = [a[1] for a in anchors]
    buckets = [dict(page=pi + 1, sku=[], det=[], unit=[], price=a[4]) for a in anchors]
    for w in words:
        x0, y0 = w[0], w[1]
        if w in anchors:
            continue
        bi = min(range(len(ay)), key=lambda i: abs(ay[i] - y0))
        if x0 < 92:
            continue                    # No column -> discard
        elif x0 < 195:
            buckets[bi]['sku'].append(w)
        elif x0 < 425:
            buckets[bi]['det'].append(w)
        elif x0 < 481:
            buckets[bi]['unit'].append(w)
        else:
            buckets[bi]['unit'].append(w)
    rows.extend(buckets)

def jsku(ws):
    ws = [w[4] for w in sorted(ws, key=lambda w: (round(w[1]), w[0]))]
    out = ''
    for t in ws:
        if not out:
            out = t
        elif out.endswith('-'):
            out += t
        else:
            out += ' ' + t
    return out

def jtxt(ws):
    ws = sorted(ws, key=lambda w: (round(w[1]), w[0]))
    return re.sub(r'\s+', ' ', ' '.join(w[4] for w in ws)).strip()

out = []
for r in rows:
    out.append(dict(page=r['page'], sku=jsku(r['sku']), name=jtxt(r['det']),
                    unit=jtxt(r['unit']), price=r['price'].replace('$', '').strip()))

json.dump(out, open('scratch_records.json', 'w'), indent=1)
print('price-anchored rows:', len(out))
with open('scratch_draft.csv', 'w', newline='', encoding='utf-8') as f:
    wr = csv.writer(f)
    wr.writerow(['idx', 'sku', 'name', 'unit', 'price'])
    for i, r in enumerate(out):
        wr.writerow([i + 1, r['sku'], r['name'], r['unit'], r['price']])
print('wrote scratch_draft.csv')
