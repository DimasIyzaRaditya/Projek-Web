import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { API_PRODUK } from '@/scripts/api';

interface Produk {
  id: number;
  nama: string;
  harga: number;
  deskripsi: string | null;
}

export default function ProductsScreen() {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProduk();
  }, []);

  const fetchProduk = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_PRODUK, {
        cache: 'no-store' as RequestCache,
      });
      if (!response.ok) {
        throw new Error('Gagal mengambil data produk');
      }
      const result = await response.json();
      setProduk(result.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProduk();
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  const renderProductCard = ({ item }: { item: Produk }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.idBadge}>
          <Text style={styles.idText}>ID: {item.id}</Text>
        </View>
      </View>
      
      <View style={styles.cardBody}>
        <Text style={styles.productName}>{item.nama}</Text>
        <Text style={styles.productPrice}>{formatRupiah(item.harga)}</Text>
        
        {item.deskripsi && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Deskripsi:</Text>
            <Text style={styles.descriptionText}>{item.deskripsi}</Text>
          </View>
        )}
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Memuat data...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
        <Text style={styles.retryText} onPress={fetchProduk}>
          Tap untuk mencoba lagi
        </Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daftar Produk</Text>
        <Text style={styles.subtitle}>
          {produk.length} produk tersedia
        </Text>
      </View>

      <FlatList
        data={produk}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada produk</Text>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  idBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  idText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    padding: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#28a745',
    marginBottom: 12,
  },
  descriptionContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  descriptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryText: {
    color: '#007AFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
  },
});
