import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  btnVoltar: {
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 4,
  },
  lastUpdate: {
    fontSize: 12,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingRight: 10,
  },
  bullet: {
    fontSize: 18,
    marginRight: 8,
    lineHeight: 22,
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
  separator: {
    height: 1,
    width: '100%',
    marginVertical: 32,
  },
});
