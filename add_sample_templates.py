import sqlite3
import json
from datetime import datetime

conn = sqlite3.connect('/home/ubuntu/welo/snapbrander-backend/snapbrander.db')
cursor = conn.cursor()

templates = [
    {
        'name': 'Business Pro',
        'name_ar': 'الأعمال المحترف',
        'slug': 'business-pro',
        'category': 'business',
        'description': 'Professional business website template',
        'description_ar': 'قالب موقع أعمال محترف',
        'preview_image': 'https://readdy.ai/api/search-image?query=professional%20business%20website%20template&width=400&height=300&seq=template1',
        'demo_url': 'https://demo.business-pro.com',
        'price': 0,
        'is_premium': False,
        'is_featured': True,
        'downloads_count': 150,
        'rating': 4.5,
        'ratings_count': 25,
        'wordpress_theme_slug': 'business-pro',
        'theme_version': '1.0.0',
        'compatible_business_types': json.dumps(['business', 'corporate', 'consulting']),
        'tags': json.dumps(['business', 'professional', 'corporate']),
        'status': 'active'
    },
    {
        'name': 'E-commerce Modern',
        'name_ar': 'التجارة الإلكترونية الحديثة',
        'slug': 'ecommerce-modern',
        'category': 'ecommerce',
        'description': 'Modern e-commerce website template',
        'description_ar': 'قالب موقع تجارة إلكترونية حديث',
        'preview_image': 'https://readdy.ai/api/search-image?query=modern%20ecommerce%20website%20template&width=400&height=300&seq=template2',
        'demo_url': 'https://demo.ecommerce-modern.com',
        'price': 29.99,
        'is_premium': True,
        'is_featured': True,
        'downloads_count': 89,
        'rating': 4.8,
        'ratings_count': 18,
        'wordpress_theme_slug': 'ecommerce-modern',
        'theme_version': '1.2.0',
        'compatible_business_types': json.dumps(['ecommerce', 'retail', 'shop']),
        'tags': json.dumps(['ecommerce', 'shop', 'modern']),
        'status': 'active'
    },
    {
        'name': 'Creative Portfolio',
        'name_ar': 'المعرض الإبداعي',
        'slug': 'creative-portfolio',
        'category': 'portfolio',
        'description': 'Creative portfolio website template',
        'description_ar': 'قالب موقع معرض إبداعي',
        'preview_image': 'https://readdy.ai/api/search-image?query=creative%20portfolio%20website%20template&width=400&height=300&seq=template3',
        'demo_url': 'https://demo.creative-portfolio.com',
        'price': 0,
        'is_premium': False,
        'is_featured': False,
        'downloads_count': 67,
        'rating': 4.2,
        'ratings_count': 12,
        'wordpress_theme_slug': 'creative-portfolio',
        'theme_version': '1.1.0',
        'compatible_business_types': json.dumps(['portfolio', 'creative', 'artist']),
        'tags': json.dumps(['portfolio', 'creative', 'art']),
        'status': 'active'
    },
    {
        'name': 'Restaurant Pro',
        'name_ar': 'المطعم المحترف',
        'slug': 'restaurant-pro',
        'category': 'restaurant',
        'description': 'Professional restaurant website template',
        'description_ar': 'قالب موقع مطعم محترف',
        'preview_image': 'https://readdy.ai/api/search-image?query=restaurant%20website%20template&width=400&height=300&seq=template4',
        'demo_url': 'https://demo.restaurant-pro.com',
        'price': 19.99,
        'is_premium': True,
        'is_featured': True,
        'downloads_count': 123,
        'rating': 4.6,
        'ratings_count': 31,
        'wordpress_theme_slug': 'restaurant-pro',
        'theme_version': '1.3.0',
        'compatible_business_types': json.dumps(['restaurant', 'food', 'cafe']),
        'tags': json.dumps(['restaurant', 'food', 'dining']),
        'status': 'active'
    }
]

for template in templates:
    cursor.execute('''
        INSERT INTO templates (
            name, name_ar, slug, category, description, description_ar,
            preview_image, demo_url, price, is_premium, is_featured,
            downloads_count, rating, ratings_count, wordpress_theme_slug,
            theme_version, compatible_business_types, tags, status,
            created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        template['name'], template['name_ar'], template['slug'], template['category'],
        template['description'], template['description_ar'], template['preview_image'],
        template['demo_url'], template['price'], template['is_premium'], template['is_featured'],
        template['downloads_count'], template['rating'], template['ratings_count'],
        template['wordpress_theme_slug'], template['theme_version'],
        template['compatible_business_types'], template['tags'], template['status'],
        datetime.now(), datetime.now()
    ))

conn.commit()
conn.close()
print('Sample templates added successfully!')
