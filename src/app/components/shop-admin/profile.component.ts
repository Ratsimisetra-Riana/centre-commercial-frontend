import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ShopService, Shop } from '../../services/shop.service';
import { ShopAdminService } from '../../services/shop-admin.service';
import { AuthService } from '../../services/auth.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-shop-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html'
})
export class ShopProfileComponent implements OnInit {
  shop: Shop = {
    name: '',
    rent: 0,
    images: [],
    description: '',
    contact: {}
  };
  loading = false;
  saving = false;
  error = '';
  success = '';
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];

  constructor(
    private shopService: ShopService,
    private shopAdmin: ShopAdminService,
    private auth: AuthService,
    private supabase: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadShop();
  }

  loadShop() {
    this.loading = true;
    const shopProfile = this.shopAdmin.getShop();
    const shopId = shopProfile?.id;
    
    if (!shopId) {
      this.error = 'ID de boutique non trouvé';
      this.loading = false;
      return;
    }

    this.shopService.get(shopId).subscribe({
      next: (data) => {
        if (data) {
          this.shop = data;
          this.imagePreviews = this.shop.images || [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading shop:', err);
        this.error = 'Erreur lors du chargement de la boutique';
        this.loading = false;
      }
    });
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      
      // Add to selected files
      this.selectedFiles = [...this.selectedFiles, ...files];
      
      // Generate previews
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreviews = [...this.imagePreviews, e.target?.result as string];
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number) {
    // If it's an existing image (not a preview), mark it for deletion
    if (index < (this.shop.images?.length || 0)) {
      // For existing images, we would need to handle deletion separately
      // For now, just remove from preview
      this.shop.images = this.shop.images?.filter((_, i) => i !== index);
    }
    // Remove from previews
    this.imagePreviews = this.imagePreviews.filter((_, i) => i !== index);
    // Remove from selected files if it's a new upload
    if (index >= (this.shop.images?.length || 0)) {
      const fileIndex = index - (this.shop.images?.length || 0);
      this.selectedFiles = this.selectedFiles.filter((_, i) => i !== fileIndex);
    }
  }

  async save() {
    this.saving = true;
    this.error = '';
    this.success = '';

    const shopProfile = this.shopAdmin.getShop();
    const shopId = shopProfile?.id;
    
    if (!shopId) {
      this.error = 'ID de boutique non trouvé';
      this.saving = false;
      return;
    }

    try {
      // Upload new images if any
      if (this.selectedFiles.length > 0) {
        const urls = await this.supabase.uploadFiles(this.selectedFiles).toPromise();
        if (urls && urls.length > 0) {
          // Combine existing images with new ones
          this.shop.images = [...(this.shop.images || []), ...urls];
        }
      }

      // Update shop via API
      this.shopService.update(shopId, this.shop).subscribe({
        next: (updated) => {
          this.shop = updated;
          this.success = 'Boutique mise à jour avec succès';
          this.saving = false;
          
          // Also update local shop admin profile
          this.shopAdmin.updateProfile({
            id: shopId,
            name: this.shop.name,
            logo: this.shop.images?.[0] || '',
            description: this.shop.description
          }).subscribe();
        },
        error: (err) => {
          console.error('Error updating shop:', err);
          this.error = 'Erreur lors de la mise à jour de la boutique';
          this.saving = false;
        }
      });
    } catch (err) {
      console.error('Error:', err);
      this.error = 'Erreur lors de l\'upload des images';
      this.saving = false;
    }
  }
}
