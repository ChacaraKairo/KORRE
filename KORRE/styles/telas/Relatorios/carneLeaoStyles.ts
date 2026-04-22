import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },

  // HEADER
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#161616',
    backgroundColor: '#0A0A0A',
    zIndex: 20,
    gap: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBtn: {
    padding: 8,
    backgroundColor: '#161616',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#2196F3',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  headerSubtitle: {
    fontSize: 8,
    fontWeight: '900',
    color: '#444',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 2,
  },

  // MONTH SELECTOR
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#111',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  monthArrow: {
    padding: 8,
  },
  monthLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  monthText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  // MAIN SCROLL
  main: {
    padding: 24,
    gap: 20,
  },

  // IMPOSTO CARD
  impostoCard: {
    borderRadius: 40,
    padding: 32,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  impostoCardPendente: {
    backgroundColor: 'rgba(33,150,243,0.05)',
    borderColor: 'rgba(33,150,243,0.2)',
  },
  impostoCardPago: {
    backgroundColor: 'rgba(0,200,83,0.05)',
    borderColor: 'rgba(0,200,83,0.2)',
  },
  impostoCardBgIcon: {
    position: 'absolute',
    top: -24,
    right: -24,
    opacity: 0.03,
    transform: [{ rotate: '-12deg' }],
  },
  impostoCardContent: {
    gap: 8,
  },
  impostoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  impostoLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  impostoValue: {
    fontSize: 44,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
    marginBottom: 8,
  },
  impostoStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  badgePago: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#00C853',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  badgePagoText: {
    color: '#0A0A0A',
    fontWeight: '900',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  badgePendente: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245,158,11,0.1)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.2)',
  },
  badgePendenteText: {
    color: '#F59E0B',
    fontWeight: '900',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  vencimento: {
    fontSize: 10,
    fontWeight: '700',
    color: '#444',
    textTransform: 'uppercase',
  },

  // LIVRO CAIXA
  livroCaixaCard: {
    backgroundColor: '#161616',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#222',
    gap: 20,
  },
  livroCaixaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  livroCaixaTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  livroCaixaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  livroCaixaRowLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#444',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  livroCaixaRowValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: '#222',
  },
  aliquotaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(33,150,243,0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(33,150,243,0.2)',
  },
  aliquotaText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#2196F3',
  },

  // DICA
  dicaBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    padding: 20,
    backgroundColor: 'rgba(33,150,243,0.05)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(33,150,243,0.1)',
  },
  dicaText: {
    flex: 1,
    fontSize: 11,
    color: '#555',
    lineHeight: 18,
  },
  dicaHighlight: {
    color: '#fff',
    fontWeight: '700',
  },

  // ACTIONS
  actionsSection: {
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 16,
  },
  actionBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  // FOOTER
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    backgroundColor: 'rgba(10,10,10,0.97)',
    borderTopWidth: 1,
    borderTopColor: '#161616',
  },
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 65,
    backgroundColor: '#2196F3',
    borderRadius: 18,
    gap: 12,
  },
  footerBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
