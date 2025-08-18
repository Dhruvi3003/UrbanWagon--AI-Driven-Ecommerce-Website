from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Product, ProductVariant
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import ProductSerializer
from rest_framework.permissions import IsAuthenticated

# class AddProductView(APIView):
#     # permission_classes = [permissions.IsAuthenticated]

#     def post(self, request):
#         # if request.user.role != 'admin':
#         #     return Response({"detail": "Only admins can add products."}, status=status.HTTP_403_FORBIDDEN)
#         print(request.data)
#         serializer = ProductSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "Product added successfully", "product": serializer.data}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AddProductView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        try:
            name = request.data.get("name")
            description = request.data.get("description")
            category = request.data.get("category")
            sub_category = request.data.get("sub_category")
            best_seller = request.data.get("best_seller") == 'true'  # incoming is a string
            price = request.data.get("price")
            sizes = request.data.getlist("size")  # ✅ receive list of sizes

            image1 = request.FILES.get("image1")
            image2 = request.FILES.get("image2")
            image3 = request.FILES.get("image3")
            image4 = request.FILES.get("image4")

            # Step 1: Create Product
            product = Product.objects.create(
                name=name,
                description=description,
                category=category,
                price = price,
                sub_category=sub_category,
                best_seller=best_seller,
            )

            # Step 2: Create a variant for each size
            for size in sizes:
                ProductVariant.objects.create(
                    product=product,
                    size=size,
                    image1=image1,
                    image2=image2,
                    image3=image3,
                    image4=image4,
                )

            return Response({"message": "Product added successfully."}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(e)
            return Response({"error": "Something went wrong."}, status=status.HTTP_400_BAD_REQUEST)



class ProductListView(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductDetailView(APIView):
    def get(self, request, pk):
        product = Product.objects.get(pk=pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RemoveProductView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
            product.delete()
            return Response({"message": "Product removed successfully."}, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UpdateProductView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request, pk, *args, **kwargs):
        try:
            product = Product.objects.get(pk=pk)
            # Update product fields
            product.name = request.data.get("name", product.name)
            product.description = request.data.get("description", product.description)
            product.category = request.data.get("category", product.category)
            product.sub_category = request.data.get("sub_category", product.sub_category)
            product.price = request.data.get("price", product.price)
            product.best_seller = request.data.get("best_seller", str(product.best_seller)).lower() in ['true', '1']
            product.save()

            sizes = request.data.getlist("size")

            # Get old variants before deleting
            old_variants = {v.size: v for v in ProductVariant.objects.filter(product=product)}

            # Remove old variants
            ProductVariant.objects.filter(product=product).delete()

            # For each size, try to get the corresponding image from FILES or fallback to old variant's image
            for size in sizes:
                old_variant = old_variants.get(size)
                # Try to get images for this size from FILES (if you upload per-size images, use image1_{size}, etc.)
                # But your frontend sends only one image1/image2/image3/image4 for all sizes, so fallback logic:
                image1 = request.FILES.get("image1") or (old_variant.image1 if old_variant else None)
                image2 = request.FILES.get("image2") or (old_variant.image2 if old_variant else None)
                image3 = request.FILES.get("image3") or (old_variant.image3 if old_variant else None)
                image4 = request.FILES.get("image4") or (old_variant.image4 if old_variant else None)
                ProductVariant.objects.create(
                    product=product,
                    size=size,
                    image1=image1,
                    image2=image2,
                    image3=image3,
                    image4=image4,
                )

            return Response({"message": "Product updated successfully."}, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response({"error": "Something went wrong."}, status=status.HTTP_400_BAD_REQUEST)