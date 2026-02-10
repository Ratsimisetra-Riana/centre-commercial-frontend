import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { CommonModule } from '@angular/common'; // contains NgFor, NgIf, etc.
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-article-list',
  imports: [CommonModule,FormsModule],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.css',
  standalone: true, // Add this
})

export class ArticleListComponent implements OnInit{
  articles: any[] = [];
  newArticle = { title: '', content: '' }; // Nouveau modèle pour le formulaire

  constructor(private articleService: ArticleService) {}
  
  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.articleService.getArticles().subscribe(data => this.articles = data);
  }

  deleteArticle(id: string): void {
    this.articleService.deleteArticle(id).subscribe(() =>
    this.loadArticles());
  }

  addArticle(): void {
    if (this.newArticle.title && this.newArticle.content) {
      this.articleService.addArticle(this.newArticle).subscribe(() => {
        this.loadArticles(); // Recharge la liste après ajout
        this.newArticle = { title: '', content: '' }; // Réinitialise le formulaire
      });
    }
  }
}
